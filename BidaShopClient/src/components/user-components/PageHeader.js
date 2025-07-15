import React, { useEffect } from 'react';
import PropTypes from 'prop-types'

function PageHeader(props) {
    return (
        <div>

            {/* Breadcrumb Section Begin */}
            <section
                className="breadcrumb-section set-bg"
                style={{ backgroundImage: `url(${('https://n-one.vn/wp-content/uploads/2023/09/354185324_796374511851574_8805141767854574616_n.jpg')})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb-text">
                                <h2>{props.title}</h2>
                                <div className="bt-option">
                                    <a href="/">Home</a>
                                    <span>{props.title}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}
        </div>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
};
export default PageHeader;