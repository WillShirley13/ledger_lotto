import Link from "next/link";
import RecentWinners from "./components/RecentWinners";

export default function Home() {
	return <div className="flex flex-col page-text">
        <div className="flex flex-col items-center justify-top min-h-screen mt-20">
            <h1 className="text-2xl md:text-3xl lg:text-5xl  md:mx-5 lg:mx-10 text-center">
                Test your luck in <span className="primary-color">Solana&apos;s</span> very own onchain lottery
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl text-center mt-10">
                Buy your tickets today and enter for a chance to win big!
            </h2>
            <div className="flex self-center mt-10">
                <Link href="/tickets" className="">
                    <button className="rounded-lg px-8 py-4 landing-page-button">
                        Buy Now!
                    </button>
                </Link>
            </div>
            <RecentWinners />
        </div>
    </div>;
}
