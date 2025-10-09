// EmployeeForm.jsx
export default function EmployeeForm({ mode = "view", employeeData, onSubmit }) {
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    const [formData, setFormData] = useState(employeeData || {});

    const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (!isView && onSubmit) onSubmit(formData);
            }}
            className="space-y-4"
        >
            <input
                type="text"
                value={formData.full_name || ""}
                onChange={e => handleChange("full_name", e.target.value)}
                disabled={isView}
                placeholder="Full Name"
                className="input-class"
            />
            {/* Other fields like email, position, etc. */}
            {!isView && <button type="submit">{isAdd ? "Add Employee" : "Save Changes"}</button>}
        </form>
    );
}
