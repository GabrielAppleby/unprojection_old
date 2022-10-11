import React from "react";

export const withDatabase = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.fetchData = this.fetchData.bind(this);
        }

        componentDidMount() {
            this.fetchData();
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if ((prevProps.itemId !== this.props.itemId || (prevProps.embedding !== this.props.embedding) ||  (prevProps.dataset !== this.props.dataset))) {
                this.fetchData();
            }
        }

        fetchData() {
            if (this.props.itemId !== null)
            {
                const url = this.props.urlGenerator(this.props.dataset, this.props.embedding, this.props.itemId);
                fetch(url)
                    .then(
                        (result) => {
                            this.props.handleDataChange(result)
                        },
                        (error) => {
                            // setIsLoaded(true);
                            // setError(true);
                        }
                    )
            }
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
};