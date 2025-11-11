import { useSelector } from "react-redux";
function PlantForm() {
    const plants = useSelector((state) => state.plants.plants);
    return (
        <div>
            <h2>Plant Form</h2>
        </div>
    );
}

export default PlantForm;