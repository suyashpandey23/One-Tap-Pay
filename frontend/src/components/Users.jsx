import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "../components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { InputBox } from "./InputBox";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user/bulk?filter=" + filter, {
          withCredentials: true,
        });
        console.log("response ", response);
        setUsers(response.data.user);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <InputBox
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
        ></InputBox>
      </div>
      {users.map((user, index) => (
        <User key={index} user={user} />
      ))}
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={(e) => {
            navigate(
              "/send?id=" +
                user._id +
                "&first_name=" +
                user.firstName +
                "&last_name=" +
                user.lastName
            );
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
