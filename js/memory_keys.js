/*
var stringJsonMemoryKeyValues = '{ \
	"CF_AL_DOOPN_G1" 	: [ \
		{ \
			"Description"		:	"Door open timeout",	\
			"Address" 			: "0x88",\
			"BitPos"				:	"0",\
			"Min"						:	"1",\
			"Max"						:	"120",\
			"Multiplier"		:	"5",\
			"Units"					: "seconds"\
		} \
	], \
	"CF_MSC3_ALDO"  	: [ \
		{ \
			"Description"		:	"Enable/disable door open timeout", \
			"Address" 			: "0xA4", \
			"BitPos"				:	"0x04", \
			"Min"						:	"0", \
			"Max"						:	"1", \
			"Multiplier"		:	"1", \
			"Units"					: "binary" \
		} \
	] \
}';

var objJsonMemoryKeyValues = JSON.parse(stringJsonMemoryKeyValues);

console.log(objJsonMemoryKeyValues.CF_AL_DOOPN_G1[0].Address);
*/