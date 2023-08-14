import PropTypes from "prop-types";

function Square({ value = "", onClick }) {
  return (
    <button
      type="button"
      className="bg-[#fff] border border-solid border-indigo-500/100 float-left text-xl font-bold h-8 -mr-[1px] -mt-[1px] p-0 text-center w-8"
      onClick={onClick}
    >
      {value}
    </button>
  );
}

Square.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default Square;
