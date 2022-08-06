import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../MainApp/Tabs";
import TopBar from "../MainApp/TopBar";

export default function UserDetails({ toggle }) {
  const [userdetails, setUserDetails] = useState({});
  const [usersPermissions, setUserPermissions] = useState([]);
  const { id } = useParams();
  async function getUserDetails() {
    try {
      const res = await axios.post("http://localhost:80/crm/service.php", {
        func: "getUserDetails",
        id: id,
      });
      console.log(res);
      if (res.data) {
        let userPermissionsDetails = [];
        let userDetailsFromDb = JSON.parse(JSON.stringify(res.data));
        setUserDetails(userDetailsFromDb);
        let ALL_PERMISSIONS = JSON.parse(sessionStorage.getItem("ALL_PERMISSIONS"));
        let usersPermissions = userDetailsFromDb.permissions;

        for (let i = 0; i < usersPermissions.length; i++) {
          for (let j = 0; j < ALL_PERMISSIONS.length; j++) {
            if (usersPermissions[i].permissionid == ALL_PERMISSIONS[j].id) {
              userPermissionsDetails.push(ALL_PERMISSIONS[j].details);
            }
          }
        }
        setUserPermissions(userPermissionsDetails);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div>
      <TopBar toggle={toggle} />
      <Tabs />
      UserDetails
      <h2>{userdetails.id}</h2>
      <h2>{userdetails.title}</h2>
      <h2>{userdetails.firstname}</h2>
      <h2>{userdetails.lastname}</h2>
      <h2>{userdetails.email}</h2>
      <h2>{userdetails.type}</h2>
      <div>Permissions</div>
      <ul>
        {usersPermissions.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
