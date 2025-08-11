import NavBar from "@/components/Navbar/Navbar";



export default function Home() {
  return (
    <div className="page">
		<NavBar/>
		<div className="content">
			<p style={{fontSize: '32px', fontWeight: '500'}}>
				Ask. Create. Connect..
			</p>
		</div>
    </div>
  );
}
