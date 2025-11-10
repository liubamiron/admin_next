'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Label,
    TextInput,
    Button,
    Toast,
    ToastToggle,
    BreadcrumbItem,
    Breadcrumb,
    FileInput,
    Tabs, TabItem
} from 'flowbite-react';
import Select from 'react-select';
import {HiCheck, HiHome} from 'react-icons/hi';
import {BsExclamation} from 'react-icons/bs';
import {useIdEmployee} from '@/hooks/users/useIdEmployee';
import {useEditEmployee} from '@/hooks/users/useEditEmployee';
import {
    citizenshipOptions,
    countryOptions, driverLicenseOptions, educationOptions, employeeFilesOptions,
    genderOptions, languagesOptions,
    maritalOptions,
    operatorOptions, SHIFT_DAY_OPTIONS, transportTypeOptions
} from '@/components/constants/filterOptions';
import {reactSelectHeightFix} from '@/components/ui/reactSelectHeightFix';
import {useDarkMode} from "@/hooks/useDarkMode";
import {useDepartments} from "@/hooks/departments/useDepartments";
import {usePositions} from "@/hooks/positions/usePositions";
import {useOffices} from "@/hooks/officies/useOffices";

const employeeSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required').min(1),
    date_of_placement: z.string().optional(),
    date_of_dismissal: z.string().min(1, 'Date is required'),
    sex: z.string().min(1, 'Gender is required'),
    dob: z.string().min(1, 'Date of Birth is required'),
    phone: z
        .array(
            z.object({
                code: z.string().min(1),
                phone: z.string().min(1, 'Phone is required'),
                operator: z.string().optional(),
            })
        )
        .nonempty('At least one phone number is required'),
    primary_contact: z.string().optional(),
    primary_contact_phone: z.string().optional(),
    children: z
        .array(
            z.object({
                name: z.string().optional(),
                dob: z.string().optional(),
                gender: z.string().optional(),
            })
        )
        .optional(),
    image: z.any().optional(),
    citizenship: z.array(z.string()).optional(),
    telegram: z.string().optional(),
    marital_status: z.string().optional(),
    languages: z.array(z.string()).optional(),
    education: z.string().optional(),
    transport_type: z.string().optional(),
    driver_license: z.array(z.string()).optional(),
    office: z.string().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    official_position: z.string().optional(),
    work_name: z.string().optional(),
    corporate_email: z.string().optional(),

    generated_documents: z.array(z.string()).optional(),

    shift: z
        .array(
            z.object({
                start_time: z.string().optional(),
                end_time: z.string().optional(),
                work_days: z.array(z.string().min(1)).optional(),
            })
        )
        .optional()
        .refine(
            (arr) =>
                !arr ||
                arr.every((shift) => {
                    const filledFields = [
                        shift.start_time,
                        shift.end_time,
                        shift.work_days?.length ? shift.work_days : undefined,
                    ].filter(Boolean);
                    return filledFields.length === 0 || filledFields.length === 3;
                }),
            {message: "All shift fields must be filled if a shift is added"}
        )
        .default([]),
    document: z
        .array(
            z.object({
                file_type: z.string().optional(),
                file: z.any().optional(),
            })
        )
        .optional()
        .refine(
            (arr) =>
                !arr ||
                arr.every((file) => {
                    const filledFields = [file.file_type, file.file].filter(Boolean);
                    return filledFields.length === 0 || filledFields.length === 2;
                }),
            {message: "All file fields must be filled if a file is added"}
        )
        .default([]),

});

export default function EmployeeEditPage() {
    const {id} = useParams();
    const router = useRouter();
    const [image, setImage] = useState("");
    const {data: employee, isLoading, isError} = useIdEmployee(id);
    const {mutate: editEmployee, isLoading: saving} = useEditEmployee();
    const {data: departmentsData = [], isLoading: depLoading} = useDepartments();
    const {data: positionsData = [], isLoading: posLoading} = usePositions();
    const {data: officesData = [], isLoading: offLoading} = useOffices();
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const isDark = useDarkMode();

    const {register, handleSubmit, control, setValue, reset, watch, formState: {errors}} = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            phone: [{code: '+373', phone: '', operator: ''}],
            primary_contact: '',
            primary_contact_phone: '',
            children: [{ name: '', dob: '', gender: '' }],
            shift: [{ start_time: '', end_time: '', work_days: [] }],
        },
    });

    const officeOptions = Array.isArray(officesData.data)
        ? officesData.data.map((office) => ({
            value: office.id,
            label: office.name,
        }))
        : [];

    const departmentOptions = Array.isArray(departmentsData.data)
        ? departmentsData.data.map((dept) => ({
            value: dept.id,
            label: dept.name,
        }))
        : [];

    const positionOptions = Array.isArray(positionsData.data)
        ? positionsData.data.map((pos) => ({
            value: pos.id,
            label: pos.name,
        }))
        : [];


    const {fields: phoneFields, append, remove} = useFieldArray({
        control,
        name: 'phone',
    });

    const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
        control,
        name: "children",
    });

    const { fields: shiftFields, append: appendShift, remove: removeShift } = useFieldArray({
        control,
        name: "shift",
    });

    const { fields: fileFields, append: appendFile, remove: removeFile } = useFieldArray({
        control,
        name: "document",
    });

    const { fields: generatedDocumentFields, append: appendGeneratedDocument, remove: removeGeneratedDocument } = useFieldArray({
        control,
        name: "generated_documents",
    });

    const { fields: notesFields, append: appendNote, remove: removeNote } = useFieldArray({
        control,
        name: "received_notes",
    });

    const { fields: day_off, append: appendDayOff, remove: removeDayOff } = useFieldArray({
        control,
        name: "day_off",
    });

    // Populate form when employee data is loaded
    useEffect(() => {
        if (employee) {
            const formatDate = (isoString) => {
                if (!isoString) return '';
                return isoString.split('T')[0]; // YYYY-MM-DD
            };

            reset({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                sex: employee.sex || '',
                dob: formatDate(employee.dob),
                date_of_placement: formatDate(employee.date_of_placement),
                date_of_dismissal: formatDate(employee.date_of_dismissal),
                email: employee.email || '',
                image: (employee.image || ""),
                phone: employee.phone?.length
                    ? employee.phone
                    : [{code: '+373', phone: '', operator: ''}],
                citizenship: employee.citizenship || [],
                telegram: employee.telegram || '',
                marital_status: employee.marital_status || '',
                languages: employee.languages || [],
                education: employee.education || '',
                children: employee.children?.length
                    ? employee.children.map(c => ({
                        name: c.name || '',
                        dob: c.dob ? c.dob.split('T')[0] : '',
                        gender: c.gender || '',
                    }))
                    : [{ name: '', dob: '', gender: '' }],
               primary_contact: employee.primary_contact || '',
               primary_contact_phone: employee.primary_contact_phone || '',
                transport_type: employee.transport_type || '',
                driver_license: employee.driver_license || [],
                office: employee.office_id || '',
                department: employee.department_id || '',
                position: employee.position_id || '',
                official_position: employee.official_position || '',
                work_name: employee.work_name || '',
                corporate_email: employee.corporate_email || '',
                shift: employee.shift?.length
                    ? employee.shift
                    : [{ start_time: '', end_time: '', work_days: [] }],
                document: employee.document?.length
                    ? employee.document.map(d => ({
                        id: d.id,
                        type: d.type,
                        file: d.file,
                        created_at: d.created_at,
                        updated_at: d.updated_at,
                    }))
                    : [{ id: '', type: '', file: '', created_at: '', updated_at: '' }],
                generated_documents: employee.generated_documents?.length
                    ? employee.generated_documents.map(d => ({
                        id: d.id,
                        template_id: d.template_id,
                        manager_id: d.manager_id,
                        employer_id: d.employer_id,
                        variables: d.variables,
                        file_path: d.file_path,
                        created_at: d.created_at,
                        updated_at: d.updated_at,
                    }))
                    : [{ id: '', template_id: '', manager_id: '', employer_id: '', variables: {}, file_path: null }],

                received_notes: employee.received_notes?.length
                    ? employee.received_notes.map(n => ({
                        id: n.id,
                        user_id: n.user_id,
                        commenter_id: n.commenter_id,
                        comment: n.comment,
                        created_at: n.created_at,
                        updated_at: n.updated_at,
                    }))
                    : [{ id: '', user_id: '', commenter_id: '', comment: '', created_at: '', updated_at: '' }],
            });
        }
    }, [employee, reset]);


    const onSubmit = (data) => {
        setSuccessMsg('');
        setErrorMsg('');

        const formData = new FormData();

        // Required fields
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('sex', data.sex);
        formData.append('dob', data.dob);
        formData.append('date_of_placement', data.date_of_placement || '');
        formData.append('date_of_dismissal', data.date_of_dismissal);
        formData.append("phone", JSON.stringify(data.phone));
        formData.append("telegram", data.telegram || '');
        formData.append("citizenship", JSON.stringify(data.citizenship || []));
        formData.append("marital_status", data.marital_status || '');
        formData.append("languages", JSON.stringify(data.languages || []));
        formData.append("education", data.education || '');
        formData.append("transport_type", data.transport_type || '');
        formData.append("driver_license", JSON.stringify(data.driver_license || []));
        formData.append("image", image || employee.image || '');
        formData.append("office", data.office || '');
        formData.append("department", data.department || '');
        formData.append("position", data.position || '');
        formData.append("official_position", data.official_position || '');
        formData.append("work_name", data.work_name || '');
        formData.append("corporate_email", data.corporate_email || '');
        formData.append("shift", JSON.stringify(data.shift) || []);

        const allFiles = [
            ...(data.existingFiles || []).map(f => ({
                file_type: f.file_type,
                file: f.file, // could be File object or string
            })),
            ...(data.document || [])
        ];

        allFiles.forEach((f, i) => {
            formData.append(`document[${i}][file_type]`, f.file_type || '');
            if (f.file instanceof File) {
                formData.append(`document[${i}][file]`, f.file);
            } else if (typeof f.file === 'string') {
                formData.append(`document[${i}][file]`, f.file); // backend path string
            }
        });

        editEmployee({id, formData}, {
            onSuccess: () => {
                setSuccessMsg('Employee updated successfully!');
                router.push('/users/employees');
            },
            onError: (err) => setErrorMsg(err.message || 'Failed to update employee.'),
        });
    };


    if (isLoading) return <div>Loading...</div>;
    if (isError || !employee) return <div>Error loading employee.</div>;

    return (
        <div className="p-0 space-y-6 md:p-4">

            <Breadcrumb>
                <BreadcrumbItem href="/" icon={HiHome}>Home</BreadcrumbItem>
                <BreadcrumbItem href="/users/employees">Employees</BreadcrumbItem>
                <BreadcrumbItem>Edit</BreadcrumbItem>
            </Breadcrumb>

            <h2 className="text-2xl font-semibold">Edit Employee</h2>

            {/* Toasts */}

            {successMsg && (
                <Toast>
                    <div
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-500">
                        <HiCheck className="h-5 w-5"/>
                    </div>
                    <div className="ml-3 text-sm font-normal">{successMsg}</div>
                    <ToastToggle onDismiss={() => setSuccessMsg('')}/>
                </Toast>
            )}

            {errorMsg && (
                <Toast>
                    <div
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-500">
                        <BsExclamation className="h-5 w-5"/>
                    </div>
                    <div className="ml-3 text-sm font-normal">{errorMsg}</div>
                    <ToastToggle onDismiss={() => setErrorMsg('')}/>
                </Toast>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
                    <div className="space-y-4 bg-white p-2 md:p-4 rounded-lg shadow dark:bg-gray-800 flex flex-col justify-between h-full">
                        <div>
                            <Label value="Profile Image"/>
                            <div>
                                <div
                                    className="w-[60%] m-auto h-auto rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                                    {image ? (
                                        typeof image === "string" ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMG}/${image}`}
                                                alt="Employee"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Employee"
                                                className="w-full h-full object-cover"
                                            />
                                        )
                                    ) : employee.image ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMG}/${employee.image}`}
                                            alt="Employee"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400 text-center">No Image</span>
                                    )}
                                </div>

                                {/* Upload button / drag & drop */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <label
                                        htmlFor="dropzone-file"
                                        className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm text-gray-700"
                                    >
                                        {image || employee.image ? "Change Image" : "Upload Image"}
                                    </label>
                                    <span className="text-xs text-gray-500">
        PNG, JPG (max 5MB)
      </span>
                                    <FileInput
                                        id="dropzone-file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setImage(file);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={'mt-12'}>
                                <Label>Date of Placement</Label>
                                <TextInput type="date" {...register('date_of_placement')} />
                                {errors.date_of_placement &&
                                    <p className="text-red-500 text-xs">{errors.date_of_placement.message}</p>}
                            </div>

                            <div className={'mt-4'}>
                                <Label>Date of Dismissal</Label>
                                <TextInput type="date" {...register('date_of_dismissal')} />
                                {errors.date_of_dismissal &&
                                    <p className="text-red-500 text-xs">{errors.date_of_dismissal.message}</p>}
                            </div>
                        </div>



                    </div>
                    <div
                        className="space-y-4 bg-white p-2 md:p-4 rounded-lg shadow dark:bg-gray-800 flex flex-col justify-between h-full">
                        <Tabs aria-label="Tabs with underline" variant="underline">
                            <TabItem title="General">
                                <div className="rounded-lg border py-4 p-2 md:p-4 mb-6 bg-[#F9FAFB] dark:bg-gray-800" >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <TextInput {...register('first_name')} />
                                            {errors.first_name &&
                                                <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
                                        </div>

                                        <div>
                                            <Label>Last Name</Label>
                                            <TextInput {...register('last_name')} />
                                            {errors.last_name &&
                                                <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
                                        </div>

                                        <div>
                                            <Label>Date of Birth</Label>
                                            <TextInput
                                                type="date" {...register('dob')}
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                                    .toISOString()
                                                    .split('T')[0]} // only allows dates 18+ years ago
                                            />
                                            {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
                                        </div>

                                        <div>
                                            <Label>Gender</Label>
                                            <Select
                                                options={genderOptions}
                                                value={genderOptions.find(opt => opt.value === watch('sex'))}
                                                onChange={(val) => setValue('sex', val?.value)}
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                            {errors.sex && <p className="text-red-500 text-xs">{errors.sex.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Marital Status</Label>
                                            <Select
                                                options={maritalOptions}
                                                value={maritalOptions.find(opt => opt.value === watch('marital_status'))}
                                                onChange={val => setValue('marital_status', val?.value || '')}
                                                placeholder="Select status..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Citizenship</Label>
                                            <Select
                                                options={citizenshipOptions}
                                                value={citizenshipOptions.filter(opt => watch('citizenship')?.includes(opt.value))}
                                                onChange={val => setValue('citizenship', val.map(v => v.value))}
                                                placeholder="Select citizenship..."
                                                isMulti
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <Label>Phone Number</Label>

                                    {/* First phone row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {/* Left: code + phone */}
                                        <div className="flex gap-1 w-full border rounded-[8px]">
                                            <Select
                                                value={countryOptions.find(opt => opt.value === watch("phone.0.code"))}
                                                onChange={val => setValue("phone.0.code", val.value)}
                                                options={countryOptions}
                                                className="w-[25%]"
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        backgroundColor: 'transparent',
                                                    }),
                                                    indicatorsContainer: (provided) => ({
                                                        ...provided,
                                                        display: 'yes', // remove dropdown arrow
                                                    }),
                                                    valueContainer: (provided) => ({
                                                        ...provided,
                                                        padding: '0 0 0 6px',
                                                    }),
                                                    singleValue: (provided) => ({
                                                        ...provided,
                                                        color: 'inherit', // match text color
                                                    }),
                                                    reactSelectHeightFix
                                                }}
                                                isDark={isDark}
                                            />
                                            <TextInput
                                                {...register("phone.0.phone")}
                                                placeholder="Phone"
                                                className=" w-[75%] dark:bg-gray-700 dark:text-white border-none focus:none countryselect"

                                            />
                                        </div>

                                        {/* Right: operator + button */}
                                        <div className="flex gap-4 w-full">
                                            <Select
                                                value={operatorOptions.find(opt => opt.value === watch("phone.0.operator"))}
                                                onChange={val => setValue("phone.0.operator", val.value)}
                                                options={operatorOptions}
                                                styles={reactSelectHeightFix}
                                                className="w-[90%]"
                                                isDark={isDark}
                                            />
                                            <Button
                                                outline
                                                type="button"
                                                color="blue"
                                                className="w-[40px] h-[40px]"
                                                onClick={() => append({code: '+373', phone: '', operator: ''})}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Additional phone rows */}
                                    {phoneFields.slice(1).map((field, idx) => (
                                        <div key={field.id} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                            {/* Left: code + phone */}
                                            <div className="flex gap-4 w-full">
                                                <Select
                                                    value={countryOptions.find(opt => opt.value === watch(`phone.${idx + 1}.code`))}
                                                    onChange={val => setValue(`phone.${idx + 1}.code`, val.value)}
                                                    options={countryOptions}
                                                    styles={reactSelectHeightFix}
                                                    className="w-[30%]"
                                                    isDark={isDark}
                                                />
                                                <TextInput
                                                    {...register(`phone.${idx + 1}.phone`)}
                                                    placeholder="Phone"
                                                    className="w-[70%]"
                                                />
                                            </div>

                                            {/* Right: operator + remove button */}
                                            <div className="flex gap-4 w-full">
                                                <Select
                                                    value={operatorOptions.find(opt => opt.value === watch(`phone.${idx + 1}.operator`))}
                                                    onChange={val => setValue(`phone.${idx + 1}.operator`, val.value)}
                                                    options={operatorOptions}
                                                    styles={reactSelectHeightFix}
                                                    className="w-[90%]"
                                                    isDark={isDark}
                                                />
                                                <Button
                                                    outline
                                                    type="button"
                                                    color="red"
                                                    className="w-[40px] h-[40px]"
                                                    onClick={() => remove(idx + 1)}
                                                >
                                                    —
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <Label>Primary Contact</Label>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <TextInput
                                                {...register("primary_contact")}
                                                placeholder="Contact Name"
                                            />
                                        </div>
                                        <div>
                                            <TextInput
                                                {...register("primary_contact_phone")}
                                                placeholder="123 456 789"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <Label>Children</Label>

                                    {childrenFields.map((field, idx) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <TextInput
                                                    {...register(`children.${idx}.name`)}
                                                    placeholder="Child Name"
                                                />
                                                {errors.children?.[idx]?.name && (
                                                    <p className="text-red-500 text-xs">{errors.children[idx].name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <TextInput
                                                    type="date"
                                                    {...register(`children.${idx}.dob`)}
                                                    max={new Date().toISOString().split('T')[0]} // disables future dates
                                                    placeholder="Date of Birth"
                                                />
                                                {errors.children?.[idx]?.dob && (
                                                    <p className="text-red-500 text-xs">{errors.children[idx].dob.message}</p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 w-full">
                                                <Select
                                                    options={genderOptions}
                                                    value={genderOptions.find(opt => opt.value === watch(`children.${idx}.gender`))}
                                                    onChange={(val) => setValue(`children.${idx}.gender`, val?.value)}
                                                    styles={reactSelectHeightFix}
                                                    className={'w-[90%]'}
                                                    isDark={isDark}
                                                />
                                                {idx === 0 ? (
                                                    <Button
                                                        outline
                                                        type="button"
                                                        color="blue"
                                                        className="w-[40px] h-[40px]"
                                                        onClick={() => appendChild({ name: "", dob: "", gender: "" })}
                                                    >
                                                        +
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        outline
                                                        type="button"
                                                        color="red"
                                                        className="w-[40px] h-[40px]"
                                                        onClick={() => removeChild(idx)}
                                                    >
                                                        —
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Email</Label>
                                            <TextInput type="email" {...register('email')} />
                                            {errors.email &&
                                                <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <Label>Telegram</Label>
                                            <TextInput type="text" {...register('telegram')} />
                                            {errors.telegram &&
                                                <p className="text-red-500 text-xs">{errors.telegram.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Education</Label>
                                            <Select
                                                options={educationOptions}
                                                value={educationOptions.find(opt => opt.value === watch('education'))}
                                                onChange={val => setValue('education', val?.value || '')}
                                                placeholder="Select status..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Languages</Label>
                                            <Select
                                                options={languagesOptions}
                                                value={languagesOptions.filter(opt => watch('languages')?.includes(opt.value))}
                                                onChange={val => setValue('languages', val.map(v => v.value))}
                                                isMulti
                                                placeholder="Select languages..."
                                                styles={reactSelectHeightFix}
                                                className="bg-[#F9FAFB] dark:bg-gray-800"
                                                isDark={isDark}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Transport Type</Label>
                                            <Select
                                                options={transportTypeOptions}
                                                value={transportTypeOptions.find(opt => opt.value === watch('transport_type'))}
                                                onChange={val => setValue('transport_type', val?.value || '')}
                                                placeholder="Select transport type..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Driver License</Label>
                                            <Select
                                                options={driverLicenseOptions}
                                                value={driverLicenseOptions.filter(opt => watch('driver_license')?.includes(opt.value))}
                                                onChange={val => setValue('driver_license', val.map(v => v.value))}
                                                isMulti
                                                placeholder="Select driver license..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabItem>
                            <TabItem title="Company">
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Office</Label>


                                            <Select
                                                options={officeOptions}
                                                value={officeOptions.find(opt => opt.value === watch('office')) || null}
                                                onChange={(val) => setValue("office", val?.value || '')}
                                                isLoading={offLoading}
                                                placeholder="Select office..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Department</Label>
                                            <Select
                                                options={departmentOptions}
                                                value={departmentOptions.find(opt => opt.value === watch('department')) || null}
                                                onChange={(val) => setValue("department", val?.value)}
                                                isLoading={depLoading}
                                                placeholder="Select department..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Positions</Label>
                                            <Select
                                                options={positionOptions}
                                                value={positionOptions.find(opt => opt.value === watch('position')) || null}
                                                onChange={(val) => setValue("position", val?.value)}
                                                isLoading={offLoading}
                                                placeholder="Select position..."
                                                styles={reactSelectHeightFix}
                                                isDark={isDark}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Official Position</Label>
                                            <TextInput
                                                {...register("official_position")}
                                                placeholder="manager"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Work Name</Label>
                                            <TextInput
                                                {...register("work_name")}
                                                placeholder="manager"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Work Email</Label>
                                            <TextInput
                                                {...register("corporate_email")}
                                                placeholder="test_work@gmail.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                                    {shiftFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                                            {/* Start Time */}
                                            <div className="flex flex-col space-y-2">
                                                <Label>Start Time</Label>
                                                <input
                                                    type="time"
                                                    className="w-full border rounded px-2 py-2"
                                                    {...register(`shift.${index}.start_time`)}

                                                />
                                            </div>

                                            {/* End Time */}
                                            <div className="flex flex-col space-y-2">
                                                <Label>End Time</Label>
                                                <input
                                                    type="time"
                                                    className="w-full border rounded px-2 py-2"
                                                    {...register(`shift.${index}.end_time`)}
                                                />
                                            </div>

                                            {/* Work Days */}
                                            <div className="flex flex-col  md:col-span-2 w-full">
                                                <Label>Work Days</Label>
                                                <Select
                                                    options={SHIFT_DAY_OPTIONS}
                                                    value={SHIFT_DAY_OPTIONS.filter(opt =>
                                                        watch(`shift.${index}.work_days`)?.includes(opt.value)
                                                    )}
                                                    onChange={(val) =>
                                                        setValue(
                                                            `shift.${index}.work_days`,
                                                            val ? val.map(v => v.value) : []
                                                        )
                                                    }
                                                    isMulti
                                                    placeholder="Select days..."
                                                    styles={{
                                                        ...reactSelectHeightFix,
                                                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                                    }}
                                                    isDark={isDark}
                                                />
                                            </div>

                                            {/* Add / Remove Buttons */}
                                            <div className="flex items-end gap-2 self-end">
                                                <Button
                                                    color="failure"
                                                    onClick={() => removeShift(index)}
                                                    size="xs"
                                                    className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                                >
                                                    −
                                                </Button>

                                                {index === shiftFields.length - 1 && (
                                                    <Button
                                                        color="blue"
                                                        onClick={() =>
                                                            appendShift({ start_time: "", end_time: "", work_days: [] })
                                                        }
                                                        size="xs"
                                                        className="flex items-center justify-center h-[42px] w-[42px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"
                                                    >
                                                        +
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </TabItem>

                            <TabItem title="Files">
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-6 px-4 space-y-6">

                                    {/* Table Header */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium text-gray-700 dark:text-gray-300 border-b pb-2">
                                        <span>File Type</span>
                                        <span>File Name</span>
                                        <span>Preview</span>
                                        <span className="text-center">Actions</span>
                                    </div>
                                    {/* Existing Files */}
                                    {employee.document?.length ? (
                                        employee.document.map((doc, index) => {
                                            const replacedFile = watch(`existingFiles.${index}.file`);


                                            // const previewUrl = replacedFile
                                            //     ? URL.createObjectURL(replacedFile)
                                            //     : `${process.env.NEXT_PUBLIC_IMG}/${doc.file}`;

                                            const previewUrl = replacedFile instanceof File
                                                ? URL.createObjectURL(replacedFile)
                                                : `${process.env.NEXT_PUBLIC_IMG}/${doc.file}`;

                                            return (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b border-gray-200 dark:border-gray-700 py-3">
                                                    {/* File Type */}
                                                    <Controller
                                                        name={`existingFiles.${index}.file_type`}
                                                        control={control}
                                                        defaultValue={doc.type}
                                                        render={({ field }) => (
                                                            <Select
                                                                options={employeeFilesOptions}
                                                                value={employeeFilesOptions.find(opt => opt.value === field.value) || null}
                                                                onChange={selected => field.onChange(selected?.value)}
                                                                placeholder="Select file type..."
                                                                isDark={isDark}
                                                            />
                                                        )}
                                                    />

                                                    {/* File Input */}
                                                    <Controller
                                                        name={`existingFiles.${index}.file`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FileInput
                                                                id={`replace-file-${index}`}
                                                                onChange={e => field.onChange(e.target.files?.[0] || null)}
                                                            />
                                                        )}
                                                    />

                                                    {/* File Preview */}
                                                    <a
                                                        href={previewUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate"
                                                    >
                                                        {replacedFile?.name || doc.file.split('/').pop()}
                                                    </a>

                                                    {/* Actions */}
                                                    <div className="flex justify-center gap-2">
                                                        {index === employee.document.length - 1 && (
                                                            <Button
                                                                size="xs"
                                                                onClick={() => appendFile({ file_type: '', file: null })}
                                                                className="h-[36px] w-[36px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"
                                                            >
                                                                +
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 text-sm">No uploaded documents yet.</p>
                                    )}

                                    {/* New Files */}
                                    {fileFields.length > 0 &&
                                        fileFields.map((file, index) => {
                                            const newFile = watch(`document.${index}.file`);
                                            const previewUrl = newFile instanceof File
                                                ? URL.createObjectURL(newFile)
                                                : newFile // fallback: assume string URL (already from backend)


                                            return (
                                                <div key={file.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b border-gray-200 dark:border-gray-700 py-3">
                                                    {/* File Type */}
                                                    <Controller
                                                        name={`document.${index}.file_type`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                options={employeeFilesOptions}
                                                                value={employeeFilesOptions.find(opt => opt.value === field.value) || null}
                                                                onChange={selected => field.onChange(selected?.value)}
                                                                placeholder="Select file type..."
                                                                isDark={isDark}
                                                            />
                                                        )}
                                                    />

                                                    {/* File Input */}
                                                    <Controller
                                                        name={`document.${index}.file`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FileInput
                                                                id={`file-${index}`}
                                                                onChange={e => field.onChange(e.target.files?.[0] || null)}
                                                            />
                                                        )}
                                                    />

                                                    {/* File Preview */}
                                                    {previewUrl ? (
                                                        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                                            {newFile.name}
                                                        </a>
                                                    ) : (
                                                        <span className="truncate text-gray-400 italic">No file yet</span>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            color="failure"
                                                            size="xs"
                                                            onClick={() => removeFile(index)}
                                                            className="h-[36px] w-[36px] rounded-lg border bg-red-700 hover:bg-red-800 text-white text-lg"
                                                        >
                                                            −
                                                        </Button>

                                                        {index === fileFields.length - 1 && (
                                                            <Button
                                                                size="xs"
                                                                onClick={() => appendFile({ file_type: '', file: null })}
                                                                className="h-[36px] w-[36px] rounded-lg border bg-blue-700 hover:bg-blue-800 text-white text-lg"
                                                            >
                                                                +
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}


                                </div>
                            </TabItem>


                            <TabItem title="Documents">
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 px-4 mb-6">
                                    <Label>Generated Documents</Label>
                                    {employee.generated_documents?.length ? (
                                        <ul className="mt-4 space-y-3">
                                            {employee.generated_documents.map((doc) => (
                                                <li key={doc.id} className="flex flex-col border-b pb-3">
                                                    <div className="flex justify-between items-center">
                                                        <span>Template ID: {doc.template_id}</span>
                                                        {doc.file_path ? (
                                                            <a
                                                                href={`${process.env.NEXT_PUBLIC_IMG}/${doc.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                View File
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-500 text-sm">No file generated</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Variables:{" "}
                                                        {Object.entries(doc.variables || {}).map(([key, value]) => (
                                                            <span key={key}>
                  <strong>{key}</strong>: {String(value)}{" "}
                </span>
                                                        ))}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 mt-4 text-sm">No generated documents.</p>
                                    )}
                                </div>
                            </TabItem>
                            <TabItem title="Notes">
                                <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 px-4 mb-6">
                                    <Label>Received Notes</Label>
                                    {employee.received_notes?.length ? (
                                        <ul className="mt-4 space-y-3">
                                            {employee.received_notes.map((note) => (
                                                <li key={note.id} className="border-b pb-3">
                                                    <div
                                                        className="text-gray-800 dark:text-gray-200 text-sm"
                                                        dangerouslySetInnerHTML={{ __html: note.comment }}
                                                    />
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        From: User #{note.commenter_id}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 mt-4 text-sm">No notes received.</p>
                                    )}
                                </div>
                            </TabItem>
                            <TabItem title="Day Off">
                                General
                            </TabItem>
                        </Tabs>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button color="gray" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </form>
        </div>
    );
}
