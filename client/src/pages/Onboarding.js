import Nav from '../components/Nav';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnBoarding = () => {
    const [cookies] = useCookies(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        url: "",
        about: "",
        matches: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 🔥 IMPORTANT: send formData directly (NOT wrapped)
            const response = await axios.put(
                "http://localhost:8000/api/users/user",
                formData
            );

            if (response.status === 200 || response.status === 201) {
                navigate("/dashboard");
            }

        } catch (err) {
            console.log(err);
            setError("Something went wrong while saving profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value =
            e.target.type === "checkbox"
                ? e.target.checked
                : e.target.value;

        const name = e.target.name;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <Nav minimal={true} showModal={false} setShowModal={() => {}} />

            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>

                        <label>First Name</label>
                        <input
                            name="first_name"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input
                                name="dob_day"
                                type="number"
                                placeholder="DD"
                                required
                                value={formData.dob_day}
                                onChange={handleChange}
                            />

                            <input
                                name="dob_month"
                                type="number"
                                placeholder="MM"
                                required
                                value={formData.dob_month}
                                onChange={handleChange}
                            />

                            <input
                                name="dob_year"
                                type="number"
                                placeholder="YYYY"
                                required
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            {["man", "woman", "more"].map((g) => (
                                <div key={g}>
                                    <input
                                        type="radio"
                                        name="gender_identity"
                                        value={g}
                                        checked={formData.gender_identity === g}
                                        onChange={handleChange}
                                    />
                                    <label>{g}</label>
                                </div>
                            ))}
                        </div>

                        <label>
                            Show Gender on my Profile
                        </label>

                        <input
                            type="checkbox"
                            name="show_gender"
                            checked={formData.show_gender}
                            onChange={handleChange}
                        />

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            {["man", "woman", "everyone"].map((g) => (
                                <div key={g}>
                                    <input
                                        type="radio"
                                        name="gender_interest"
                                        value={g}
                                        checked={formData.gender_interest === g}
                                        onChange={handleChange}
                                    />
                                    <label>{g}</label>
                                </div>
                            ))}
                        </div>

                        <label>About</label>
                        <input
                            name="about"
                            required
                            value={formData.about}
                            onChange={handleChange}
                        />

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <button
                            className="primary-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Continue"}
                        </button>

                    </section>

                    <section>
                        <label>Profile Photo</label>
                        <input
                            name="url"
                            type="url"
                            required
                            value={formData.url}
                            onChange={handleChange}
                        />

                        <div className="photo-container">
                            {formData.url && (
                                <img
                                    src={formData.url}
                                    alt="preview"
                                />
                            )}
                        </div>
                    </section>
                </form>
            </div>
        </>
    );
};

export default OnBoarding;