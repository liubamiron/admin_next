import React from 'react';
import { Button, Label, TextInput } from '@/components/ui'; // adjust import paths
import Select from 'react-select';



export const GeneralTab = ({
                                                          register,
                                                          errors,
                                                          watch,
                                                          setValue,
                                                          isDark,
                                                          append,
                                                          remove,
                                                          phoneFields,
                                                          appendChild,
                                                          removeChild,
                                                          genderOptions,
                                                          maritalOptions,
                                                          citizenshipOptions,
                                                          countryOptions,
                                                          operatorOptions,
                                                          educationOptions,
                                                          languagesOptions,
                                                          transportTypeOptions,
                                                          driverLicenseOptions,
                                                          reactSelectHeightFix,
                                                      }) => {
    return (
        <div className="space-y-6">
            {/* ===== Personal Info ===== */}
            <div className="rounded-lg border py-4 p-2 md:p-4 bg-[#F9FAFB] dark:bg-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <Label>First Name</Label>
                        <TextInput {...register('first_name')} />
                        {errors.first_name && (
                            <p className="text-red-500 text-xs">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Last Name</Label>
                        <TextInput {...register('last_name')} />
                        {errors.last_name && (
                            <p className="text-red-500 text-xs">{errors.last_name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Date of Birth</Label>
                        <TextInput
                            type="date"
                            {...register('dob')}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                .toISOString()
                                .split('T')[0]}
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-xs">{errors.dob.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Gender</Label>
                        <Select
                            options={genderOptions}
                            value={genderOptions.find((opt) => opt.value === watch('sex'))}
                            onChange={(val) => setValue('sex', val?.value)}
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                        {errors.sex && (
                            <p className="text-red-500 text-xs">{errors.sex.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== Marital + Citizenship ===== */}
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label>Marital Status</Label>
                        <Select
                            options={maritalOptions}
                            value={maritalOptions.find(
                                (opt) => opt.value === watch('marital_status')
                            )}
                            onChange={(val) => setValue('marital_status', val?.value || '')}
                            placeholder="Select status..."
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label>Citizenship</Label>
                        <Select
                            options={citizenshipOptions}
                            value={citizenshipOptions.filter((opt) =>
                                watch('citizenship')?.includes(opt.value)
                            )}
                            onChange={(val) => setValue('citizenship', val.map((v) => v.value))}
                            placeholder="Select citizenship..."
                            isMulti
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                    </div>
                </div>
            </div>

            {/* ===== Phones ===== */}
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4">
                <Label>Phone Number</Label>

                {/* First phone */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    <div className="flex gap-1 w-full border rounded-[8px]">
                        <Select
                            value={countryOptions.find(
                                (opt) => opt.value === watch('phone.0.code')
                            )}
                            onChange={(val) => setValue('phone.0.code', val.value)}
                            options={countryOptions}
                            className="w-[25%]"
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                        <TextInput
                            {...register('phone.0.phone')}
                            placeholder="Phone"
                            className="w-[75%] dark:bg-gray-700 dark:text-white border-none"
                        />
                    </div>

                    <div className="flex gap-4 w-full">
                        <Select
                            value={operatorOptions.find(
                                (opt) => opt.value === watch('phone.0.operator')
                            )}
                            onChange={(val) => setValue('phone.0.operator', val.value)}
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
                            onClick={() => append({ code: '+373', phone: '', operator: '' })}
                        >
                            +
                        </Button>
                    </div>
                </div>

                {/* Additional phones */}
                {phoneFields.slice(1).map((field, idx) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4"
                    >
                        <div className="flex gap-4 w-full">
                            <Select
                                value={countryOptions.find(
                                    (opt) => opt.value === watch(`phone.${idx + 1}.code`)
                                )}
                                onChange={(val) => setValue(`phone.${idx + 1}.code`, val.value)}
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

                        <div className="flex gap-4 w-full">
                            <Select
                                value={operatorOptions.find(
                                    (opt) => opt.value === watch(`phone.${idx + 1}.operator`)
                                )}
                                onChange={(val) => setValue(`phone.${idx + 1}.operator`, val.value)}
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

            {/* ===== Children ===== */}
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4">
                <Label>Children</Label>
                {watch('children')?.map((_, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                    >
                        <div>
                            <TextInput
                                {...register(`children.${idx}.name`)}
                                placeholder="Child Name"
                            />
                        </div>
                        <div>
                            <TextInput
                                type="date"
                                {...register(`children.${idx}.dob`)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="flex gap-2 w-full">
                            <Select
                                options={genderOptions}
                                value={genderOptions.find(
                                    (opt) => opt.value === watch(`children.${idx}.gender`)
                                )}
                                onChange={(val) => setValue(`children.${idx}.gender`, val?.value)}
                                styles={reactSelectHeightFix}
                                className="w-[90%]"
                                isDark={isDark}
                            />
                            {idx === 0 ? (
                                <Button
                                    outline
                                    type="button"
                                    color="blue"
                                    className="w-[40px] h-[40px]"
                                    onClick={() =>
                                        appendChild({ name: '', dob: '', gender: '' })
                                    }
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

            {/* ===== Email + Telegram ===== */}
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <Label>Email</Label>
                        <TextInput type="email" {...register('email')} />
                        {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Telegram</Label>
                        <TextInput type="text" {...register('telegram')} />
                        {errors.telegram && (
                            <p className="text-red-500 text-xs">{errors.telegram.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== Education & Languages ===== */}
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <Label>Education</Label>
                        <Select
                            options={educationOptions}
                            value={educationOptions.find(
                                (opt) => opt.value === watch('education')
                            )}
                            onChange={(val) => setValue('education', val?.value || '')}
                            placeholder="Select education..."
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                    </div>
                    <div>
                        <Label>Languages</Label>
                        <Select
                            options={languagesOptions}
                            value={languagesOptions.filter((opt) =>
                                watch('languages')?.includes(opt.value)
                            )}
                            onChange={(val) => setValue('languages', val.map((v) => v.value))}
                            isMulti
                            placeholder="Select languages..."
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                    </div>
                </div>
            </div>

            {/* ===== Transport & License ===== */}
            <div className="rounded-lg border bg-[#F9FAFB] dark:bg-gray-800 py-4 p-2 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <Label>Transport Type</Label>
                        <Select
                            options={transportTypeOptions}
                            value={transportTypeOptions.find(
                                (opt) => opt.value === watch('transport_type')
                            )}
                            onChange={(val) => setValue('transport_type', val?.value || '')}
                            placeholder="Select transport type..."
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                    </div>
                    <div>
                        <Label>Driver License</Label>
                        <Select
                            options={driverLicenseOptions}
                            value={driverLicenseOptions.filter((opt) =>
                                watch('driver_license')?.includes(opt.value)
                            )}
                            onChange={(val) =>
                                setValue('driver_license', val.map((v) => v.value))
                            }
                            isMulti
                            placeholder="Select driver license..."
                            styles={reactSelectHeightFix}
                            isDark={isDark}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
