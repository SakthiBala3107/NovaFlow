
import type { SelectedFieldProps } from "../../types/date.types";

const SelectedField = ({ label, name, options, ...props }: SelectedFieldProps) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-700 mb-2"
            >
                {label}
            </label>

            <select
                name={name}
                id={name}
                {...props}
                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {options?.map((option, idx) => {
                    const value =
                        typeof option === "string" ? option : option?.value ?? "";
                    const label =
                        typeof option === "string" ? option : option?.label ?? value;

                    return (
                        <option key={idx} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default SelectedField;
