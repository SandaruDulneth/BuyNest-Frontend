import BannerSlider from "../../components/Slider.jsx";
import DealsRow from "../../components/dealsRow.jsx";

export default function ScrollTest() {
    return (
        <div className="h-screen overflow-y-auto">
           <BannerSlider/>
            <DealsRow/>
        </div>
    );
}