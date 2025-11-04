
'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Label, TextInput, Button, Toast, ToastToggle} from 'flowbite-react';
import Select from 'react-select';
import {HiCheck} from 'react-icons/hi';
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
    date_of_placement: z.string().min(1, 'Date of placement is required'),
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
});

export default function EmployeeEditPage() {
    const {id} = useParams();
    const router = useRouter();
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
                email: employee.email || '',
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
        formData.append('date_of_placement', data.date_of_placement);
        formData.append("phone", JSON.stringify(data.phone));


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
        <div className="p-4 space-y-6 relative">
            <h2 className="text-2xl font-semibold">Edit Employee</h2>

            {/* Toasts */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
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
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Label>Email</Label>
                        <TextInput type="email" {...register('email')} />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2 mt-2 w-full">
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
                                type="button"
                                color="blue"
                                size="xs"
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
                                    type="button"
                                    color="failure"
                                    size="xs"
                                    onClick={() => remove(idx + 1)}
                                >
                                    <RiDeleteBin4Fill />
                                </Button>
                            </div>
                        ))}
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
