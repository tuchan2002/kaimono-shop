import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import BackButton from "../../components/BackButton";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;

  return (
    <div className="p-5 bg-white rounded-lg">
      <BackButton url="/" />
      <div className="flex flex-col gap-3">
        <h2 className="uppercase text-center">History</h2>
        <h4>You have {history.length} ordered</h4>
        <table className="">
          <thead>
            <tr className="text-left">
              <th>PaymentID</th>
              <th>Date of Purchased</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((items) => (
              <tr key={items._id} className="border-y">
                <td className="py-2">{items._id}</td>
                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/history/${items._id}`}
                    className="font-bold underline text-blue-500"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderHistory;
