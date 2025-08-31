import Aurora from "@/components/Aurora/Aurora";
import NavBar from "@/components/Navbar/Navbar";
import TextType from "@/components/TextType/TextType";
import VisualInput from "@/components/VisualInput/VisualInput";



export default function Home() {

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
    </div>
  );
}
