'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
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
    countryOptions, driverLicenseOptions, educationOptions,
    genderOptions, languagesOptions,
    maritalOptions,
    operatorOptions, transportTypeOptions
} from '@/components/constants/filterOptions';
import {reactSelectHeightFix} from '@/components/ui/reactSelectHeightFix';

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
    // primary_contacts: z
    //     .array(
    //         z.object({
    //             name: z.string().optional(),
    //             number: z.string().optional(),
    //         })
    //     )
    //     .optional(),
    children: z
        .array(
            z.object({
                name: z.string().min(1, 'Child name is required'),
                dob: z.string().min(1, 'Date of birth is required'),
                gender: z.string().min(1, 'Gender is required'),
            })
        )
        .optional(),
    image: z.any().optional(),
    citizenship: z.array(z.string()).optional(),
    telegram: z.string().optional(),
    marital_status: z.string().optional(),
    languages: z.string().optional(),
    education: z.string().optional(),
    transport_type: z.string().optional(),
    driver_license: z.string().optional(),
});

export default function EmployeeEditPage() {
    const {id} = useParams();
    const router = useRouter();
    const [image, setImage] = useState("");
    const {data: employee, isLoading, isError} = useIdEmployee(id);
    const {mutate: editEmployee, isLoading: saving} = useEditEmployee();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const {register, handleSubmit, control, setValue, reset, watch, formState: {errors}} = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            phone: [{code: '+373', phone: '', operator: ''}],
            primary_contact: '',
            primary_contact_phone: '',
            children: [{ name: '', dob: '', gender: '' }],
        },
    });

    const {fields: phoneFields, append, remove} = useFieldArray({
        control,
        name: 'phone',
    });

    // const { fields: contactFields, append:appendContact, remove:removeContact } = useFieldArray({
    //     control,
    //     name: "primary_contacts",
    // });

    const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
        control,
        name: "children",
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
                citizenship: employee.citizenship || '',
                telegram: employee.telegram || '',
                marital_status: employee.marital_status || '',
                languages: employee.languages || '',
                education: employee.education || '',
                children: employee.children?.length
                    ? employee.children.map(c => ({
                        name: c.name || '',
                        dob: c.dob ? c.dob.split('T')[0] : '',
                        gender: c.gender || '',
                    }))
                    : [{ name: '', dob: '', gender: '' }], // <-- default row
               primary_contact: employee.primary_contact || '',
               primary_contact_phone: employee.primary_contact_phone || '',
                transport_type: employee.transport_type || '',
                driver_license: employee.driver_license || '',
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
        formData.append("languages", data.languages || '');
        formData.append("education", data.education || '');
        formData.append("transport_type", data.transport_type || '');
        formData.append("driver_license", data.driver_license || '');
        formData.append("image", image || employee.image || '');

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
                                {/* Thumbnail preview */}
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
                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
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
                                            <TextInput type="date" {...register('dob')} />
                                            {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
                                        </div>

                                        <div>
                                            <Label>Gender</Label>
                                            <Select
                                                options={genderOptions}
                                                value={genderOptions.find(opt => opt.value === watch('sex'))}
                                                onChange={(val) => setValue('sex', val?.value)}
                                                styles={reactSelectHeightFix}
                                            />
                                            {errors.sex && <p className="text-red-500 text-xs">{errors.sex.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Marital Status</Label>
                                            <Select
                                                options={maritalOptions}
                                                value={maritalOptions.find(opt => opt.value === watch('marital_status'))}
                                                onChange={val => setValue('marital_status', val?.value || '')}
                                                placeholder="Select status..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Citizenship</Label>
                                            <Select
                                                options={citizenshipOptions}
                                                value={citizenshipOptions.find(opt => opt.value === watch('citizenship'))}
                                                onChange={val => setValue('citizenship', val?.value || '')}
                                                placeholder="Select citizenship..."
                                                isMulti
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
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

                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
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


                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
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


                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
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
                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Education</Label>
                                            <Select
                                                options={educationOptions}
                                                value={educationOptions.find(opt => opt.value === watch('education'))}
                                                onChange={val => setValue('education', val?.value || '')}
                                                placeholder="Select status..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Languages</Label>
                                            <Select
                                                options={languagesOptions}
                                                value={languagesOptions.find(opt => opt.value === watch('languages'))}
                                                onChange={val => setValue('languages', val?.value || '')}
                                                placeholder="Select languages..."
                                                isMulti
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 bg-gray-50 py-4 p-2 md:p-4 mb-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Transport Type</Label>
                                            <Select
                                                options={transportTypeOptions}
                                                value={transportTypeOptions.find(opt => opt.value === watch('transport_type'))}
                                                onChange={val => setValue('transport_type', val?.value || '')}
                                                placeholder="Select transport type..."
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label>Driver License</Label>
                                            <Select
                                                options={driverLicenseOptions}
                                                value={driverLicenseOptions.find(opt => opt.value === watch('driver_license'))}
                                                onChange={val => setValue('driver_license', val?.value || '')}
                                                placeholder="Select driver license..."
                                                isMulti
                                                styles={reactSelectHeightFix}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabItem>
                            <TabItem title="Company">
                                General
                            </TabItem>
                            <TabItem title="Files">
                                General
                            </TabItem>
                            <TabItem title="Documents">
                                General
                            </TabItem>
                            <TabItem title="Notes">
                                General
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
