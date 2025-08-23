const StatCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className="p-5 w-full rounded-[14px] bg-white font-ubuntu flex justify-between items-center cursor-pointer [&_svg]:text-primary"
  >
    <span className="font-semibold">{label}</span>
    <span className="px-[10px] py-[3px] font-semibold rounded-full border border-primary bg-primary-foreground text-primary">
      {value}
    </span>
  </div>
);

export default StatCard;
