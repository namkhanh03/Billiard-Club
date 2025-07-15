import React from 'react';
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import '../css/flaticon.css';
import '../css/owl.carousel.min.css';
import '../css/barfiller.css';
import '../css/magnific-popup.css';
import '../css/slicknav.min.css';
import '../css/style.css';
import 'font-awesome/css/font-awesome.min.css';
import './Contact.css';

function Contact() {
    return (
        <div>
            {/* Contact Section Begin */}
            <section className="contact-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="section-title contact-title">
                                <span>Contact Us</span>
                                <h2>GET IN TOUCH</h2>
                            </div>
                            <div className="contact-widget">
                                <div className="cw-text">
                                    <i className="fa fa-map-marker" />
                                    <p>
                                        Bida Club
                                        <br /> Hà Nội
                                    </p>
                                </div>
                                <div className="cw-text">
                                    <i className="fa fa-mobile" />
                                    <p>(+84) 123 456 789</p>
                                </div>
                                <div className="cw-text email">
                                    <i className="fa fa-envelope" />
                                    <p>bidaclubteams@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Iframe thay cho form */}
                        <div className="col-lg-8">
                            <div className="map-embed" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.533140711544!2d106.6799829748199!3d10.77017605928369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1e72dcf349%3A0xa6472de471db8bdb!2zNDkgxJAuIFBoYW4gTmd1eWVuLCBQaMaw4budbmcgNCwgUXXhuq1uIDMsIEjDoCBO4buZaSBDaMOtbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1712549234503!5m2!1sen!2s"
                                    width="100%"
                                    height="380"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{ border: 0 }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Contact Section End */}
        </div>
    );
}

export default Contact;
