import psycopg2

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_db():
    """
    Gets the db object for this request, allows us to reuse db object if already created.
    Returns: The db object

    """
    if 'db' not in g:
        g.db = psycopg2.connect(
            current_app.config['DATABASE'],
        )

    return g.db


def get_db_cursor():
    return get_db().cursor()


def close_db(e=None):
    """
    Closes the db object for this request if it exists.
    Args:
        e: An error object we are just blatantly ignoring at the moment.

    Returns: None, closes db as side effect.

    """
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    """
    Initializes the database.
    Returns: None, initializes the database as a side effect.

    """
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.cursor().execute(f.read())
        db.commit()


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    """
    Initializes the application.
    Args:
        app: A flask app to initialize. Cannot be None.

    Returns: None, initializes the app as a side effect.

    """
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
