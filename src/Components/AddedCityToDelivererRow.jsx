import React from "react";

function AddedCityToDelivererRow({
  allCities,
  index,
  removeAddedCityForDeliverer,
  cityUpdatedForDeliverer,
  selectedCity,
  delivery_cost,
  return_cost,
}) {
  return (
    <tr>
      <td>
        <div className="form-outline">
          <select
            name={"cities[" + index + "]"}
            id={"cities[" + index + "]"}
            className="select form-control-lg"
            onChange={() => {
              cityUpdatedForDeliverer(index);
            }}
            defaultValue={selectedCity}>
            {allCities &&
              allCities.map((c, index) => (
                <option key={index} value={c.city}>
                  {c.city}
                </option>
              ))}
          </select>
        </div>
      </td>
      <td>
        <div className="form-outline">
          <input
            type="text"
            name={"del_costs[" + index + "]"}
            id={"del_costs[" + index + "]"}
            placeholder={delivery_cost}
            value={delivery_cost}
            className="form-control form-control-lg"
            onChange={() => {
              cityUpdatedForDeliverer(index);
            }}
          />
        </div>
      </td>
      <td>
        <div className="form-outline">
          <input
            type="text"
            name={"return_costs[" + index + "]"}
            id={"return_costs[" + index + "]"}
            placeholder={return_cost}
            value={return_cost}
            className="form-control form-control-lg"
            onChange={() => {
              cityUpdatedForDeliverer(index);
            }}
          />
        </div>
      </td>
      <td style={{ textAlign: "right" }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            removeAddedCityForDeliverer(index);
          }}>
          -
        </button>
      </td>
    </tr>
  );
}

export default AddedCityToDelivererRow;
