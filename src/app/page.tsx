import Aurora from "@/components/Aurora/Aurora";
import NavBar from "@/components/Navbar/Navbar";
import Plans from "@/components/Plans/Plans";
import Possibilities from "@/components/Possibilities/Possibilities";
import ShinyText from "@/components/ShinyText/ShinyText";
import TextType from "@/components/TextType/TextType";
import VisualInput from "@/components/VisualInput/VisualInput";


export default function Home() {

	const freePlan = [
		'Access to the base AI model', 
		'Standard response speed', 
		'limited number of answers'
	];

	const premiumPlan = [
		'Access to advanced AI models',
		'Priority access and fast response', 
		'Early access to new features',
		'Unlimited number of requests'
	];


  return (
    <div className="page">
		<Aurora/>
		<NavBar/>
		<div className="content">
			<div style={{fontSize: '32px', fontWeight: '500', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", gap: '40px'}}>
				<TextType text={['Ask. Create. Connect..', '']}/>
				<VisualInput/>
			</div>
		</div>
		<div className="possibilities">
			<h1 className="possibilities-title"><ShinyText text="Possibilities"/></h1>
			<Possibilities/>
		</div>
		<div className="plans">
			<h1 className="plans-title"><ShinyText text="Tariff plans"/></h1>
			<div className="plans-items">
				<Plans
					title="Free"
					subtitle="For those who want to try"
					list={freePlan}
					price={0}
					buttonText="Start for free"
				/>
				<Plans
					title="Premium"
					subtitle="For users with high demands"
					list={premiumPlan}
					price={7}
					buttonText="Soon"
				/>
			</div>
		</div>
		<div className="footer">
			<p>All rights reserved © 2025</p>
		</div>
    </div>
  );
}
