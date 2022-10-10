import io
import os
import json
from sqlite3 import Row
from typing import Dict, List, Union, Tuple

import numpy as np
from PIL import Image
from flask import Flask, jsonify, send_file, send_from_directory
from flask.wrappers import Response
from werkzeug.exceptions import abort

from flaskr.db import get_db_cursor, get_db

TSNE_KEY = "tsne"
PCA_KEY = "pca"
MDS_KEY = "mds"
LLE_KEY = "lle"
UMAP_KEY = "umap"

MNIST = 'mnist'
SPHERE = 'sphere'
SPHEREFULLDATA = 'spherefulldata'
SWISSROLL = 'swissroll'
SWISSROLLFULLDATA = 'swissrollfulldata'
CLASSIFIERS = 'classifiers'
FASHION = 'fashion'
XRAY = 'xray'


def create_app(test_config=None):
    """
    The application factory.
    Args:
        test_config: Used to configure the application differently for testing.

    Returns:

    """
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.environ.get('DATABASE_URL'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    def get_raw_3dcoord_response(dataset: str, instance_id: str) -> Response:
        """
        Formulates a string response from the string name and the instance id.
        Args:
            dataset: The dataset to grab the response from.
            instance_id: The id of the instance. Cannot be None.
        Returns: A response containing the string or an error message. Never None.
        """
        cursor = get_db_cursor()
        cursor.execute(
            ' SELECT raw_x, raw_y, raw_z FROM {} i WHERE i.id = %s'.format(dataset),
            (instance_id,)
        )
        row: Row = cursor.fetchone()
        col_names: List[str] = [desc.name for desc in cursor.description]

        if row is None:
            abort(404, "sphere coord id {0} doesn't exist.".format(instance_id))

        entry = entry_from_row(row, col_names)

        response: Response = custom_json_response(entry)

        return response

    def get_image_response(dataset_name: str, image_name: str, instance_id: str) -> Response:
        """
        Formulates an image response from the image type name and the instance id.
        Args:
            dataset_name: The name of the dataset to grab the image from. Cannot be None.
            image_name: The name of the image type. Cannot be None.
            instance_id: The id of the instance. Cannot be None.

        Returns: A response containing the image or an error message. Never None.

        """
        cursor = get_db_cursor()
        cursor.execute(
            "SELECT {} FROM {} i WHERE i.id = %s".format(image_name, dataset_name), (instance_id,)
        )
        row: Tuple = cursor.fetchone()

        if row is None:
            abort(404, "image id {0} doesn't exist.".format(instance_id))

        image_buffer = image_buffer_from_row(row)

        response = custom_blob_response(image_buffer)

        return response

    def get_model_response(embedding_type: str) -> Response:
        """
        Formulates a model response from the embedding type.
        Args:
            embedding_type: The name of the embedding type. Cannot be None.

        Returns: A response containing the model corresponding to the embedding type or an error
        message. Never None.

        """
        json_data = json.load(open("./flaskr/{}/model.json".format(embedding_type)))

        response = custom_json_response(json_data)

        return response

    def get_all_coords_response(dataset: str, embedding_name: str) -> Response:
        """
        Gets the first 2000 of the coords for a specific embedding.
        Args:
            embedding_name: The name of the embedding. Cannot be None.

        Returns: A response containing all of the coords for a specific embedding. Cannot be None.

        """
        x_name: str = embedding_name + '_x'
        y_name: str = embedding_name + '_y'
        selct_cmd: str = 'SELECT id, {}, {}'
        if dataset != SPHERE and dataset != SWISSROLL and dataset != SPHEREFULLDATA and dataset != SWISSROLLFULLDATA:
            selct_cmd += ', label'
        else:
            selct_cmd += ', {}_error'.format(embedding_name)
        cursor = get_db_cursor()
        cursor.execute(
            selct_cmd.format(x_name, y_name) +
            ' FROM {} i'.format(dataset)
        )
        rows: List[Tuple] = cursor.fetchall()
        col_names: List[str] = [desc.name for desc in cursor.description]

        if rows is None:
            abort(404, "There are no coords")

        entries: List[Dict] = entries_from_rows_and_col_names(rows, col_names)
        response: Response = custom_json_response(entries)

        return response

    def key_cludge(key):
        """
        Cludge that allows me to use one sql table and also not write special cases -- because I'm
        a heathen.
        Args:
            key: The key to transform to 'x' or 'y' expected by clients. Cannot be None.

        Returns: The transformed key. ('x' or 'y'), never None.

        """
        if key == 'tsne_x' or key == 'pca_x' or key == 'mds_x' or key == 'lle_x' or \
                key == 'umap_x':
            return 'x'
        elif key == 'tsne_y' or key == 'pca_y' or key == 'mds_y' or key == 'lle_y' or \
                key == 'umap_y':
            return 'y'
        return key

    def entry_from_row(row: Row, col_names: List[str]) -> Dict:
        """
        Transforms a row object to an equivalent dictionary representing the entry.
        Args:
            row: The row object to transform. Cannot be None.
            col_names: The names of the columns. Cannot be None.

        Returns: The dictionary representation of the row entry. Never None.

        """
        entry: Dict = {}
        for idx, key in enumerate(col_names):  # type: int, str
            key = key_cludge(key)
            entry[key] = row[idx]
        return entry

    def entries_from_rows_and_col_names(rows: List[Tuple], col_names: List[str]) -> List[Dict]:
        """
        Transforms a list of row objects to a list of dictionary objects representing the entries.
        Args:
            rows: The rows to transform, cannot be None.
            col_names: The names of the columns. Cannot be None.

        Returns: The transformed list of dictionaries. Never None, may be empty.

        """
        entries: List[Dict] = []
        for row in rows:  # type: Tuple
            entry: Dict = entry_from_row(row, col_names)
            entries.append(entry)
        return entries

    def image_buffer_from_row(row: Tuple) -> io.BytesIO:
        """
        Reconstructs an image buffer from a row.
        Args:
            row: The row entry representing an image buffer. Cannot be None.

        Returns: The reconstructed image buffer. Never None.

        """
        raw_bytes: memoryview = row[0]
        arr: np.array = np.frombuffer(raw_bytes, dtype=np.float32)
        scaled_arr: np.array = arr * 255
        formatted_arr: np.array = scaled_arr.reshape(28, 28)

        img: Image = Image.fromarray(formatted_arr, "F")
        png_compat_img: Image = img.convert("L")
        buffered: io.BytesIO = io.BytesIO()
        png_compat_img.save(buffered, format="PNG")
        buffered.seek(0)
        return buffered

    def custom_json_response(item: Union[Dict, List]) -> Response:
        """
        Creates a JSON response from a dictionary or list.
        Args:
            item: The item to convert to a JSON response. Cannot be None.

        Returns: The JSON response. Never None.

        """
        response: Response = jsonify(item)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    def custom_blob_response(item: io.BytesIO) -> Response:
        """
        Creates a JSON response from a bytes buffer.
        Args:
            item: The bytes buffer to create the response from. Cannot be None.

        Returns: The JSON response encapsulating the bytes buffer. Never None.

        """
        response = send_file(
            item,
            attachment_filename='image',
            mimetype='image/png'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    @app.route('/<path:dataset>/<string:embedding_type>/coords', methods=['GET'])
    def get_all_coords(dataset, embedding_type):
        return get_all_coords_response(dataset, embedding_type)

    @app.route('/<path:dataset>/raw/coord/<int:instance_id>', methods=['GET'])
    def get_unprojected_coord(dataset, instance_id):
        return get_raw_3dcoord_response(dataset, instance_id)

    @app.route('/<string:dataset>/<string:embedding_type>/image/<int:instance_id>', methods=['GET'])
    def get_raw_image(dataset, embedding_type, instance_id):
        full_image_name = "{}_image".format(embedding_type)
        return get_image_response(dataset, full_image_name, instance_id)

    @app.route('/<string:dataset>/<string:embedding_type>/model', methods=['GET'])
    def get_model(dataset, embedding_type):
        path = os.path.join('js_models', dataset, embedding_type)
        return get_model_response(path)

    @app.route('/<string:dataset>/<string:embedding_type>/<string:file_name>', methods=['GET'])
    def get_shards(dataset, embedding_type, file_name):
        path = os.path.join('js_models', dataset, embedding_type)
        response = send_from_directory(path, file_name)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    from . import db
    db.init_app(app)

    return app


application = create_app()

