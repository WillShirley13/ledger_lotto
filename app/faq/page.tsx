"use client";

import React from "react";
import FaqListItem from "../components/FaqListItem";
import { ledgerLottoFaqs } from "./faqs";
const faq = () => {
    const faqs = ledgerLottoFaqs();
	return (
		<div className="container mx-auto flex flex-col flex-shrink justify-center landing-page-boarder page-text">
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
