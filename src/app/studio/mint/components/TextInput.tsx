import { Dispatch, FC, SetStateAction } from "react";

interface InputProps {
    label: string;
    value: string;
    placeholder?: string;
    onChange: Dispatch<SetStateAction<string>>;
}

export const TextInput: FC<InputProps> = ({ label, placeholder, value, onChange }: InputProps) => {
    return (
        <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-50">
                {label}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    type="text"
                    id="price"
                    value={value}
                    onChange={(e) => { onChange(e.target.value) }}
                    className="block w-72 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};
