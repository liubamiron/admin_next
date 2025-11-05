
'use client';

import {useParams, usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Label, TextInput, Button, Toast, ToastToggle, BreadcrumbItem, Breadcrumb, FileInput} from 'flowbite-react';
import Select from 'react-select';
import {HiCheck, HiHome} from 'react-icons/hi';
import {BsExclamation} from 'react-icons/bs';
import {useIdEmployee} from '@/hooks/users/useIdEmployee';
import {useEditEmployee} from '@/hooks/users/useEditEmployee';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import {countryOptions, genderOptions, operatorOptions} from '@/components/constants/filterOptions';
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
    image: z.any().optional(),
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
        defaultValues: {phone: [{code: '+373', phone: '', operator: ''}]},
    });

    const {fields: phoneFields, append, remove} = useFieldArray({
        control,
        name: 'phone',
    });

    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        return {name: seg[0].toUpperCase() + seg.slice(1), href};
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
                    : [{ code: '+373', phone: '', operator: '' }],
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
        formData.append("image", image);

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
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow dark:bg-gray-800 flex flex-col justify-between h-full">
                        <div className="w-full">
                            <Label value="Profile Image" />
                            <div >
                                {/* Thumbnail preview */}
                                <div className="w-[60%] m-auto h-auto rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
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
                        </div>

                    </div>
                <div >
                    <div>
                        <Label>First Name</Label>
                        <TextInput {...register('first_name')} />
                        {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
                    </div>

                    <div>
                        <Label>Last Name</Label>
                        <TextInput {...register('last_name')} />
                        {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
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

                    <div>
                        <Label>Date of Birth</Label>
                        <TextInput type="date" {...register('dob')} />
                        {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
                    </div>

                    <div>
                        <Label>Date of Placement</Label>
                        <TextInput type="date" {...register('date_of_placement')} />
                        {errors.date_of_placement &&
                            <p className="text-red-500 text-xs">{errors.date_of_placement.message}</p>}
                    </div>

                    <div>

                        <div>
                            <Label>Date of Dismissal</Label>
                            <TextInput type="date" {...register('date_of_dismissal')} />
                            {errors.date_of_dismissal && <p className="text-red-500 text-xs">{errors.date_of_dismissal.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label>Email</Label>
                        <TextInput type="email" {...register('email')} />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                    <div className="flex flex-col gap-2 w-full">
                        {/* Master row */}
                        <div className="flex gap-2 w-full items-center">
                            <Select
                                value={countryOptions.find(opt => opt.value === watch("phone.0.code"))}
                                onChange={val => setValue("phone.0.code", val.value)}
                                options={countryOptions}
                                styles={{ ...reactSelectHeightFix, container: (base) => ({ ...base, width: 120 }) }}
                            />
                            <TextInput {...register("phone.0.phone")} placeholder="Phone" className="flex-1" />
                            <Select
                                value={operatorOptions.find(opt => opt.value === watch("phone.0.operator"))}
                                onChange={val => setValue("phone.0.operator", val.value)}
                                options={operatorOptions}
                                styles={{ ...reactSelectHeightFix, container: (base) => ({ ...base, width: 150 }) }}
                            />
                            <Button
                                outline
                                type="button"
                                color="blue"
                                size="md"
                                className={"text-lg"}
                                onClick={() => append({ code: '+373', phone: '', operator: '' })}
                            >
                                +
                            </Button>
                        </div>

                        {/* Dynamically added child rows */}
                        {phoneFields.slice(1).map((field, idx) => (
                            <div key={field.id} className="flex gap-2 w-full items-center">
                                <Select
                                    value={countryOptions.find(opt => opt.value === watch(`phone.${idx + 1}.code`))}
                                    onChange={val => setValue(`phone.${idx + 1}.code`, val.value)}
                                    options={countryOptions}
                                    styles={{ ...reactSelectHeightFix, container: (base) => ({ ...base, width: 120 }) }}
                                />
                                <TextInput {...register(`phone.${idx + 1}.phone`)} placeholder="Phone" className="flex-1" />
                                <Select
                                    value={operatorOptions.find(opt => opt.value === watch(`phone.${idx + 1}.operator`))}
                                    onChange={val => setValue(`phone.${idx + 1}.operator`, val.value)}
                                    options={operatorOptions}
                                    styles={{ ...reactSelectHeightFix, container: (base) => ({ ...base, width: 150 }) }}
                                />
                                <Button
                                    outline
                                    type="button"
                                    color="red"
                                    size="md"
                                    onClick={() => remove(idx + 1)}
                                >
                                    —
                                </Button>
                            </div>
                        ))}
                    </div>
                    </div>


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
