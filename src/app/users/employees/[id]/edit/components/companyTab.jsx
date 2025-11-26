// pages/edit/components/CompanyTab.jsx
import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import {reactSelectHeightFix} from "@/components/ui/reactSelectHeightFix";
import {useTranslation} from "@/providers";

export const CompanyTab = ({
                               control,
                               register,
                               isDark,
                               shiftFields,
                               appendShift,
                               removeShift,
                               officeOptions,
                               departmentOptions,
                               positionOptions,
                               offLoading,
                               depLoading,
                           }) => {
    const SHIFT_DAY_OPTIONS = [
        { value: "1", label: "Monday" },
        { value: "2", label: "Tuesday" },
        { value: "3", label: "Wednesday" },
        { value: "4", label: "Thursday" },
        { value: "5", label: "Friday" },
        { value: "6", label: "Saturday" },
        { value: "7", label: "Sunday" },
    ];

    const {t} = useTranslation();

    return (
        <>
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div className="flex flex-col space-y-2">
                        <Label>{t("Office")}</Label>
                        <Controller
                            name="office"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={officeOptions}
                                    isLoading={offLoading}
                                    placeholder="Select office..."
                                    onChange={(val) => field.onChange(val?.value || "")}
                                    value={officeOptions.find((opt) => opt.value === field.value) || null}
                                    styles={reactSelectHeightFix}
                                    isDark={isDark}
                                />
                            )}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>{t("Department")}</Label>
                        <Controller
                            name="department"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={departmentOptions}
                                    isLoading={depLoading}
                                    placeholder="Select department..."
                                    onChange={(val) => field.onChange(val?.value || "")}
                                    value={departmentOptions.find((opt) => opt.value === field.value) || null}
                                    styles={reactSelectHeightFix}
                                    isDark={isDark}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-lg border  py-4 p-2 md:p-4 mb-6 bg-[#F9FAFB] dark:bg-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div className="flex flex-col space-y-2">
                        <Label>{t("Position")}</Label>
                        <Controller
                            name="position"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={positionOptions}
                                    placeholder="Select position..."
                                    onChange={(val) => field.onChange(val?.value || "")}
                                    value={positionOptions.find((opt) => opt.value === field.value) || null}
                                    styles={reactSelectHeightFix}
                                    isDark={isDark}
                                />
                            )}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>{t("Official_Position")}</Label>
                        <TextInput {...register("official_position")} placeholder="Manager" />
                    </div>
                </div>
            </div>

            {/* Shifts */}
            <div className="rounded-lg border  py-4 p-2 md:p-4 mb-6 bg-[#F9FAFB] dark:bg-gray-800">
                {shiftFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                        <div className="flex flex-col space-y-2">
                            <Label>{t("Start_Time")}</Label>
                            <input
                                type="time"
                                className="w-full border rounded px-2 py-2"
                                {...register(`shift.${index}.start_time`)}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label>{t("End_Time")}</Label>
                            <input
                                type="time"
                                className="w-full border rounded px-2 py-2"
                                {...register(`shift.${index}.end_time`)}
                            />
                        </div>
                        <div className="flex flex-col md:col-span-4">
                            <Label>{t("Work_Days")}</Label>
                            <Controller
                                name={`shift.${index}.work_days`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={SHIFT_DAY_OPTIONS}
                                        isMulti
                                        placeholder="Select days..."
                                        onChange={(val) =>
                                            field.onChange(val ? val.map((v) => v.value) : [])
                                        }
                                        value={SHIFT_DAY_OPTIONS.filter((opt) =>
                                            field.value?.includes(opt.value)
                                        )}
                                        styles={reactSelectHeightFix}
                                        isDark={isDark}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-row justify-end gap-4 ">
                            <Button
                                color="red"
                                onClick={() => removeShift(index)}
                                size="xs"
                                className="h-[42px] w-[42px]"
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
