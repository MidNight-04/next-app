const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] cursor-pointer hover:bg-secondary [&_div]:hover:text-primary"
  >
    <div className="text-secondary flex flex-row">
      <p className="text-[13px] font-semibold leading-none -md:text-xs">
        {children}
      </p>
    </div>
  </button>
);

export default ActionButton;
