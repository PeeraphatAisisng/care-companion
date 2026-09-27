export function CheckboxGroup({
  name,
  options,
  selected = [],
}: {
  name: string;
  options: { value: string; label: string }[] | string[];
  selected?: string[];
}) {
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <label
          key={item.value}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-3 py-2"
        >
          <input
            type="checkbox"
            name={name}
            value={item.value}
            defaultChecked={selected.includes(item.value)}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
}
