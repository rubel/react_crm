import axios from "axios";
import { Field, Form, Formik } from "formik";
import { default as React } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

export default class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPermissions: [],
    };
  }

  componentDidMount() {
    let permData = JSON.parse(sessionStorage.getItem("ALL_PERMISSIONS"));
    this.setState({ allPermissions: permData });
  }

  submitForm = async (formData) => {
    console.log(formData);
    console.log(JSON.stringify(formData));
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "registerUser",
        formData: JSON.stringify(formData),
      });

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <TopBar toggle={this.props.toggle} />
        <Tabs />

        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: "24px", marginBottom: "20px" }}>Add a new user</div>
          <div>
            <Formik
              initialValues={{
                title: "Mr.",
                firstName: "",
                lastName: "",
                userid: "",
                email: "",
                password: "",
                confirmPassword: "",
                userType: "",
                perms: [],
              }}
              onSubmit={(values) => {
                this.submitForm(values);
              }}>
              <Form>
                <div className="add-user-form">
                  <div className="details-legend">
                    <p style={{ padding: "5px 12px 0px 0px" }}>User Details</p>
                  </div>
                  {/*................title......................*/}
                  <div className="form-outline">
                    <label className="form-custom-label">Title: </label>
                    <Field as="select" name="title" className="select form-control-lg" style={{ width: "100%" }}>
                      <option value="mr.">Mr.</option>
                      <option value="mrs.">Mrs.</option>
                    </Field>
                  </div>

                  <div className="form-outline">
                    <label className="form-custom-label">First Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="form-control form-control-lg"
                    />
                  </div>

                  <div className="form-outline">
                    <label className="form-custom-label">Last Name</label>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="form-control form-control-lg"
                    />
                  </div>

                  <div className="form-outline">
                    <label className="form-custom-label">User id</label>
                    <Field type="text" name="userid" placeholder="User Id" className="form-control form-control-lg" />
                  </div>

                  <div className="form-outline">
                    <label className="form-custom-label">e-mail</label>
                    <Field type="text" name="email" placeholder="email" className="form-control form-control-lg" />
                  </div>

                  <div className="form-outline">
                    <label className="form-custom-label">Password</label>
                    <Field type="password" name="password" placeholder="" className="form-control form-control-lg" />
                  </div>

                  <div className="form-outline">
                    <label className="form-custom-label">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder=""
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>

                {/*..........permissions.....here................*/}
                <div className="add-user-perm">
                  <div className="permission-legend">
                    <p style={{ padding: "5px 12px 0px 0px" }}>Permissions</p>
                  </div>

                  {this.state.allPermissions &&
                    this.state.allPermissions.map((perm, index) => (
                      <div className="permission-checkbox" key={index}>
                        <Field type="checkbox" value={perm.id} name="perms" />
                        <label className="form-custom-label" style={{ fontSize: "16px", paddingLeft: "5px" }}>
                          {perm.details}
                        </label>
                      </div>
                    ))}
                  <div style={{ float: "right", width: "100%", padding: "42px 10px 3px 10px" }}>
                    <button style={{ width: "100%" }} className="btn btn-primary btn-lg" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}
