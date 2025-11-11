// pages/edit/components/CompanyTab.jsx
import React from 'react';
import {Button, Label, Select, TextInput} from "flowbite-react";

export const CompanyTab = ({
                               register,
                               setValue,
                               watch,
                               shiftFields,
                               appendShift,
                               removeShift,
                               officeOptions,
                               departmentOptions,
                               positionOptions,
                               offLoading,
                               depLoading,
                               isDark,
                           }) => {
    const SHIFT_DAY_OPTIONS = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' },
    ];

    return (
        <>
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
                            styles={{ control: (provided) => ({ ...provided, minHeight: '38px' }) }}
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
                            styles={{ control: (provided) => ({ ...provided, minHeight: '38px' }) }}
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
                            styles={{ control: (provided) => ({ ...provided, minHeight: '38px' }) }}
                            isDark={isDark}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label>Official Position</Label>
                        <TextInput
                            {...register("official_position")}
                            placeholder="Manager"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label>Work Name</Label>
                        <TextInput {...register("work_name")} placeholder="Manager" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label>Work Email</Label>
                        <TextInput {...register("corporate_email")} placeholder="test_work@gmail.com" />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                {shiftFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                        <div className="flex flex-col space-y-2">
                            <Label>Start Time</Label>
                            <input
                                type="time"
                                className="w-full border rounded px-2 py-2"
                                {...register(`shift.${index}.start_time`)}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>End Time</Label>
                            <input
                                type="time"
                                className="w-full border rounded px-2 py-2"
                                {...register(`shift.${index}.end_time`)}
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2 w-full">
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
                                styles={{ control: (provided) => ({ ...provided, minHeight: '38px' }) }}
                                isDark={isDark}
                            />
                        </div>

                        <div className="flex items-end gap-2 self-end">
                            <Button
                                color="failure"
                                onClick={() => removeShift(index)}
                                size="xs"
                                className="h-[42px] w-[42px]"
                            >
                                −
                            </Button>

                            {index === shiftFields.length - 1 && (
                                <Button
                                    color="blue"
                                    onClick={() => appendShift({ start_time: "", end_time: "", work_days: [] })}
                                    size="xs"
                                    className="h-[42px] w-[42px]"
                                >
                                    +
                                </Button>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </>
    );
};
