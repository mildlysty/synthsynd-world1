import React from 'react';
import { Gift, Heart, CheckCircle2, Lock , ExternalLink } from 'lucide-react';

export default function AirdropQuests() {
	return (
		<section aria-label="Airdrop quests">
			<Gift aria-hidden="true" />
			<Heart aria-hidden="true" />
		</section>
	);
}

const XLogo =({ classname }) => { classname = classname; return (
  < svg view Box="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classname}>
    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)}  

