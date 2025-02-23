"use client";

import React from "react";
import FaqListItem from "../components/FaqListItem";
import { ledgerLottoFaqs } from "./faqs";
const faq = () => {
    const faqs = ledgerLottoFaqs();
	return (
		<div className="container flex flex-col xs:max-w-screen-xs sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto justify-center landing-page-boarder page-text px-4 md:px-6 py-8">
			<h2 className="primary-color text-center text-3xl mb-6 mt-4">
				Frequently Asked Questions...
			</h2>
            {faqs.map((faq, index) => (
                <FaqListItem 
                    key={index}
                    question={faq.question} 
                    answer={faq.answer}
                />
            ))}
		</div>
	);
};

export default faq;
