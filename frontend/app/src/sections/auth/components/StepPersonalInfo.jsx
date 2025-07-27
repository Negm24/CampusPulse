import React from 'react';
import { useForm } from 'react-hook-form';

const StepPersonalInfo = ({ next, updateForm, formData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: formData,
    });

    const onSubmit = (data) => {
        updateForm(data);
        next();
    };

    return (
        <div>
            <h2 className="step-title">Personal Information</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-input"
                        {...register('first_name', {
                            required: 'First name is required',
                            minLength: {
                                value: 2,
                                message: 'Minimum 2 characters',
                            },
                        })}
                    />
                    {errors.first_name && (
                        <p className="form-error">
                            {errors.first_name.message}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-input"
                        {...register('last_name', {
                            required: 'Last name is required',
                            minLength: {
                                value: 2,
                                message: 'Minimum 2 characters',
                            },
                        })}
                    />
                    {errors.last_name && (
                        <p className="form-error">{errors.last_name.message}</p>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-input"
                        {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: 'Invalid phone number',
                            },
                        })}
                        placeholder="1234567890"
                    />
                    {errors.phone && (
                        <p className="form-error">{errors.phone.message}</p>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                        className="form-input form-select"
                        {...register('gender', {
                            required: 'Gender is required',
                        })}
                    >
                        <option value="">-- Select Gender --</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                            Prefer not to say
                        </option>
                    </select>
                    {errors.gender && (
                        <p className="form-error">{errors.gender.message}</p>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Birthdate</label>
                    <input
                        type="date"
                        className="form-input"
                        {...register('birthdate', {
                            required: 'Birthdate is required',
                            validate: {
                                validDate: (value) => {
                                    const date = new Date(value);
                                    const now = new Date();
                                    return (
                                        date < now ||
                                        'Birthdate must be in the past'
                                    );
                                },
                                minAge: (value) => {
                                    const date = new Date(value);
                                    const now = new Date();
                                    const age =
                                        now.getFullYear() - date.getFullYear();
                                    return (
                                        age >= 13 ||
                                        'You must be at least 13 years old'
                                    );
                                },
                            },
                        })}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.birthdate && (
                        <p className="form-error">{errors.birthdate.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="button button-primary"
                    style={{ width: '100%' }}
                >
                    Next
                </button>
            </form>
        </div>
    );
};

export default StepPersonalInfo;
