// variables global
var myMap = new Map();
var api = "0XUH5ZVKMA8NIJ2J";
var url; 
var timeout = 120000; //2 mins
var chart;
var interval;

function chart() {

	var symbol = document.getElementById("numb").value;

	if (data.indexOf(symbol) === -1) {
		alert (symbol + ' is not listed on NASDAQ Stock Exchange!');
		return;
	}

	url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
		+ symbol + "&interval=3600min&apikey=" + api; 

	console.log(url);

	fetch(url, {method: 'get'
	}).then(function(response) {
		
		// Examine the text in the response
	  	response.json().then(function(data) {
	    //document.getElementById("demo").innerHTML = JSON.stringify(data);

	        var str = JSON.stringify(data);
	        var obj = JSON.parse(str);

			var dailys = obj["Time Series (Daily)"];

			for(var prop in dailys) {
				var keyString = prop;
				var data = dailys[prop]["4. close"];

				myMap.set(keyString, data);
			}

			chart = new CanvasJS.Chart("chartContainer", {
				animationEnabled: true,
				title:{
					text: "Stocks Quotes: " + symbol,
					fontColor: "orange"
				},
				axisX:{
					title : "Date",
					titleFontColor: "black",
					valueFormatString: "DD MMM"
				},
				axisY: {
					title: "Stock Price",
					titleFontColor: "black",
					includeZero: false,
					scaleBreaks: {
						autoCalculate: true
					}
				},
				data: [{
					type: "line",
					xValueFormatString: "DD MMM",
					color: "green",
					dataPoints: dataPoints(myMap)
				}]
			});
		
			chart.render();	
		});
	}).catch(function(err) {
		alert('Error occured. Restart the page.');
	});

	interval = setInterval(myFunction(), timeout);
}

function dataPoints(myMap) {

	var array = [];
	var i = 0, j = 10;
	for (var [key, value] of myMap) {
		var keyDate = key.split("-");
		var month = parseInt(keyDate[1]) - 1;

		//year-month-date and price (int)
		array.push ({x : new Date(keyDate[0], month.toString(), keyDate[2]),
					y : parseFloat(value)});
		//console.log(keyDate[0] + value);
	}
	return array;
}

function myFunction() {

	console.log("Fetching...");

	// Get the value of the input field with id="numb"
	symbol = document.getElementById("numb").value;

	url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
		+ symbol + "&interval=3600min&apikey=" + api; 

	fetch(url, {method: 'get'
	}).then(function(response) {
		// Examine the text in the response
	  response.json().then(function(data) {
	    //document.getElementById("demo").innerHTML = JSON.stringify(data);

	    var str = JSON.stringify(data);
	    var obj = JSON.parse(str);

	    //"2017-11-03 13:07:00" or "2017-11-03"
	    if (hasWhiteSpace(obj["Meta Data"]["3. Last Refreshed"])) {
	    	var time = obj["Meta Data"]["3. Last Refreshed"].split(" ");	
	    } else {
	        var time = obj["Meta Data"]["3. Last Refreshed"];
	    }

	    /* {
	        	"1. open": "1022.1100", 
	        	"2. high": "1028.3800", 	
	    		"3. low": "1020.3100", 
	        	"4. close": "1028.1900",
	            "5. volume": "266535"
	    	} */
	    var timeNowObj = obj["Time Series (Daily)"][time];

	    //"1028.1900"
	    var stockNow = parseFloat(timeNowObj["4. close"]);

	    var prevStock = chart.options.data[0].dataPoints[1].y;

	    var img = document.createElement("img");
		img.src = "up.gif";
		var src = document.getElementById("demo");
		src.appendChild(img);

	    if (parseFloat(prevStock) > stockNow) {
			img.src = "down.gif";
	    } else if (parseFloat(prevStock) > stockNow) {

	    } else {

	    }

	     //document.getElementById("demo").innerHTML = stockNow.toFixed(2);

	    //latest entry
	    chart.options.data[0].dataPoints[0].y = stockNow;
		chart.render();
	  });
	}).catch(function(err) {
		alert('Error occured. Restart the page.');
	});

	console.log("Next fetch in " + Math.floor(timeout / 60000) + " minutes...");
}

function hasWhiteSpace(s) {
	return s.indexOf(' ') >= 0;
}

function stopFunc() {
	console.log("Stopped fetching...");
	clearInterval(t);
}

var data = ["AAAP","AABA","AAL","AAME","AAOI","AAON","AAPL","AAWW","AAXJ","AAXN","ABAC","ABAX","ABCB","ABCD","ABCO","ABDC","ABEO","ABEOW","ABIL","ABIO","ABLX","ABMD","ABTL","ABTX","ABUS","ABY","ACAD","ACBI","ACER","ACERW","ACET","ACFC","ACGL","ACGLO","ACGLP","ACHC","ACHN","ACHV","ACIA","ACIU","ACIW","ACLS","ACMR","ACNB","ACOR","ACRS","ACRX","ACSF","ACST","ACTA","ACTG","ACWI","ACWX","ACXM","ADAP","ADBE","ADES","ADHD","ADI","ADMA","ADMP","ADMS","ADOM","ADP","ADRA","ADRD","ADRE","ADRO","ADRU","ADSK","ADTN","ADUS","ADVM","ADXS","ADXSW","AEGN","AEHR","AEIS","AEMD","AERI","AETI","AEY","AEZS","AFAM","AFH","AFHBL","AFMD","AFSI","AGEN","AGFS","AGFSW","AGII","AGIIL","AGIO","AGLE","AGNC","AGNCB","AGNCN","AGND","AGRX","AGTC","AGYS","AGZD","AHGP","AHPA","AHPAU","AHPAW","AHPI","AIA","AIMC","AIMT","AINV","AIRG","AIRR","AIRT","AKAM","AKAO","AKBA","AKCA","AKER","AKRX","AKTS","AKTX","ALBO","ALCO","ALDR","ALDX","ALGN","ALGT","ALIM","ALJJ","ALKS","ALLT","ALNY","ALOG","ALOT","ALPN","ALQA","ALRM","ALRN","ALSK","ALT","ALTR","ALTY","ALXN","AMAG","AMAT","AMBA","AMBC","AMBCW","AMCA","AMCN","AMCX","AMD","AMDA","AMED","AMGN","AMKR","AMMA","AMNB","AMOT","AMPH","AMRB","AMRK","AMRN","AMRS","AMSC","AMSF","AMSWA","AMTD","AMTX","AMWD","AMZN","ANAB","ANAT","ANCB","ANCX","ANDA","ANDAR","ANDAU","ANDAW","ANDE","ANGI","ANGO","ANIK","ANIP","ANSS","ANTH","ANY","AOBC","AOSL","APDN","APDNW","APEI","APEN","APLP","APOG","APOP","APOPW","APPF","APPN","APPS","APRI","APTI","APTO","APVO","APWC","AQB","AQMS","AQXP","ARAY","ARCB","ARCC","ARCI","ARCW","ARDM","ARDX","AREX","ARGS","ARGX","ARII","ARKR","ARLP","ARLZ","ARNA","AROW","ARQL","ARRS","ARRY","ARTNA","ARTW","ARTX","ARWR","ASCMA","ASET","ASFI","ASMB","ASML","ASNA","ASND","ASPS","ASPU","ASRV","ASRVP","ASTC","ASTE","ASUR","ASV","ASYS","ATAC","ATACR","ATACU","ATAI","ATAX","ATEC","ATHN","ATHX","ATLC","ATLO","ATNI","ATNX","ATOM","ATOS","ATRA","ATRC","ATRI","ATRO","ATRS","ATSG","ATTU","ATVI","ATXI","AUBN","AUDC","AUPH","AUTO","AVAV","AVDL","AVEO","AVGO","AVGR","AVHI","AVID","AVIR","AVNW","AVXL","AVXS","AWRE","AXAS","AXDX","AXGN","AXON","AXSM","AXTI","AYTU","AZPN","AZRX","BABY","BANF","BANFP","BANR","BANX","BASI","BATRA","BATRK","BBBY","BBGI","BBH","BBOX","BBRG","BBRY","BBSI","BCAC","BCACR","BCACU","BCACW","BCBP","BCLI","BCOM","BCOR","BCOV","BCPC","BCRX","BCTF","BDGE","BDSI","BEAT","BEBE","BECN","BELFA","BELFB","BFIN","BFIT","BGCP","BGFV","BGNE","BHAC","BHACR","BHACU","BHACW","BHBK","BHF","BIB","BICK","BIDU","BIIB","BIOC","BIOL","BIOP","BIOS","BIS","BIVV","BJRI","BKCC","BKEP","BKEPP","BKMU","BKSC","BKYI","BL","BLBD","BLCM","BLDP","BLDR","BLFS","BLIN","BLKB","BLMN","BLMT","BLPH","BLRX","BLUE","BLVD","BLVDU","BLVDW","BMCH","BMLP","BMRA","BMRC","BMRN","BMTC","BNCL","BNDX","BNFT","BNSO","BNTC","BNTCW","BOBE","BOCH","BOFI","BOFIL","BOJA","BOKF","BOKFL","BOLD","BOMN","BONT","BOOM","BOSC","BOTJ","BOTZ","BPFH","BPFHP","BPMC","BPOP","BPOPM","BPOPN","BPRN","BPTH","BRAC","BRACR","BRACU","BRACW","BRCD","BREW","BRID","BRKL","BRKR","BRKS","BRQS","BRQSW","BSET","BSF","BSFT","BSPM","BSQR","BSRR","BSTC","BSTG","BTEC","BUFF","BUR","BUSE","BV","BVSN","BVXV","BVXVW","BWEN","BWFG","BWINA","BWINB","BWLD","BYBK","BYFC","BYSI","BZUN","CA","CAAS","CAC","CACC","CACG","CACQ","CADC","CAFD","CAKE","CALA","CALD","CALI","CALL","CALM","CAMP","CAMT","CAPR","CAR","CARA","CARB","CARG","CARO","CART","CARV","CARZ","CASC","CASH","CASI","CASM","CASS","CASY","CATB","CATC","CATH","CATM","CATS","CATY","CATYW","CAVM","CBAK","CBAN","CBAY","CBF","CBFV","CBIO","CBLI","CBMG","CBMX","CBMXW","CBOE","CBPO","CBRL","CBSH","CBSHP","CCBG","CCCL","CCCR","CCD","CCIH","CCLP","CCMP","CCNE","CCOI","CCRC","CCRN","CCUR","CCXI","CDC","CDEV","CDK","CDL","CDNA","CDNS","CDTI","CDTX","CDW","CDXC","CDXS","CDZI","CECE","CECO","CELC","CELG","CELGZ","CELH","CEMI","CEMP","CENT","CENTA","CENX","CERC","CERCW","CERN","CERS","CETV","CETX","CETXP","CETXW","CEVA","CEY","CEZ","CFA","CFBI","CFBK","CFCO","CFCOU","CFCOW","CFFI","CFFN","CFMS","CFNB","CFO","CFRX","CG","CGBD","CGEN","CGIX","CGNT","CGNX","CGO","CHCI","CHCO","CHDN","CHEF","CHEK","CHEKW","CHFC","CHFN","CHFS","CHI","CHKE","CHKP","CHMA","CHMG","CHNR","CHRS","CHRW","CHSCL","CHSCM","CHSCN","CHSCO","CHSCP","CHTR","CHUBA","CHUBK","CHUY","CHW","CHY","CIBR","CID","CIDM","CIFS","CIGI","CIL","CINF","CIU","CIVB","CIVBP","CIZ","CIZN","CJJD","CKPT","CLAR","CLBS","CLCT","CLDC","CLDX","CLFD","CLIR","CLIRW","CLLS","CLMT","CLNE","CLNT","CLRB","CLRBW","CLRBZ","CLRO","CLSD","CLSN","CLUB","CLVS","CLWT","CLXT","CMCO","CMCSA","CMCT","CME","CMFN","CMLS","CMPR","CMRX","CMSSU","CMTA","CMTL","CNAC","CNACR","CNACU","CNACW","CNAT","CNBKA","CNCE","CNCR","CNET","CNFR","CNIT","CNMD","CNOB","CNSL","CNTF","CNTY","CNXN","CNXR","COBZ","CODA","CODX","COGT","COHR","COHU","COKE","COLB","COLL","COLM","COMM","COMT","CONE","CONN","COOL","CORE","CORI","CORT","COST","COUP","COWN","COWNL","CPAH","CPHC","CPIX","CPLA","CPLP","CPRT","CPRX","CPSH","CPSI","CPSS","CPST","CPTA","CPTAG","CPTAL","CRAI","CRAY","CRBP","CRED","CREE","CREG","CRESY","CRIS","CRME","CRMT","CRNT","CROX","CRSP","CRTN","CRTO","CRUS","CRVL","CRVS","CRWS","CRZO","CSA","CSB","CSBK","CSBR","CSCO","CSF","CSFL","CSGP","CSGS","CSII","CSIQ","CSJ","CSML","CSOD","CSPI","CSQ","CSSE","CSTE","CSTR","CSWC","CSWI","CSX","CTAS","CTBI","CTG","CTHR","CTIB","CTIC","CTMX","CTRE","CTRL","CTRN","CTRP","CTRV","CTSH","CTSO","CTWS","CTXR","CTXRW","CTXS","CUBA","CUBN","CUI","CUNB","CUR","CUTR","CVBF","CVCO","CVCY","CVGI","CVGW","CVLT","CVLY","CVO","CVTI","CVV","CWAY","CWBC","CWCO","CWST","CXDC","CXRX","CXSE","CY","CYAD","CYAN","CYBE","CYBR","CYCC","CYCCP","CYHHZ","CYOU","CYRN","CYRX","CYRXW","CYTK","CYTR","CYTX","CYTXW","CZFC","CZNC","CZR","CZWI","DAIO","DAKT","DARE","DAVE","DAX","DBVT","DCIX","DCOM","DCPH","DDBI","DELT","DELTW","DENN","DEPO","DERM","DEST","DFBG","DFFN","DFNL","DFRG","DFVL","DFVS","DGICA","DGICB","DGII","DGLD","DGLY","DGRE","DGRS","DGRW","DHIL","DHXM","DIOD","DISCA","DISCB","DISCK","DISH","DJCO","DLBL","DLBS","DLHC","DLTH","DLTR","DMLP","DMPI","DMRC","DMTX","DNBF","DNKN","DORM","DOTA","DOTAR","DOTAU","DOTAW","DOVA","DOX","DRAD","DRIO","DRIOW","DRNA","DRRX","DRYS","DSGX","DSKE","DSKEW","DSLV","DSPG","DSWL","DTEA","DTRM","DTUS","DTYL","DTYS","DUSA","DVAX","DVCR","DVY","DWAC","DWAQ","DWAS","DWAT","DWCH","DWFI","DWIN","DWLD","DWLV","DWPP","DWSN","DWTR","DXCM","DXGE","DXJS","DXLG","DXPE","DXPS","DXTR","DXYN","DYNT","DYSL","DZSI","EA","EACQ","EACQU","EACQW","EAGL","EAGLU","EAGLW","EARS","EBAY","EBAYL","EBIO","EBIX","EBMT","EBSB","EBTC","ECHO","ECOL","ECPG","ECYT","EDAP","EDBI","EDGE","EDGW","EDIT","EDUC","EEFT","EEI","EEMA","EFAS","EFBI","EFII","EFOI","EFSC","EGAN","EGBN","EGHT","EGLE","EGLT","EGOV","EGRX","EHTH","EIGI","EIGR","EKSO","ELEC","ELECU","ELECW","ELGX","ELON","ELSE","ELTK","EMB","EMCB","EMCF","EMCG","EMCI","EMIF","EMITF","EMKR","EML","EMMS","EMXC","ENDP","ENFC","ENG","ENPH","ENSG","ENT","ENTA","ENTG","ENTL","ENZL","ENZY","EPAY","EPIX","EPZM","EQBK","EQFN","EQIX","EQRR","ERI","ERIC","ERIE","ERII","ESBK","ESCA","ESDI","ESDIW","ESEA","ESES","ESG","ESGD","ESGE","ESGG","ESGR","ESGU","ESIO","ESLT","ESND","ESPR","ESQ","ESRX","ESSA","ESXB","ETFC","ETRM","ETSY","EUFN","EVAR","EVBG","EVEP","EVGBC","EVGN","EVK","EVLMC","EVLV","EVOK","EVOL","EVSTC","EWBC","EWZS","EXA","EXAC","EXAS","EXEL","EXFO","EXLS","EXPD","EXPE","EXPO","EXTR","EXXI","EYE","EYEG","EYEGW","EYES","EYESW","EZPW","FAAR","FAB","FAD","FALN","FANG","FANH","FARM","FARO","FAST","FAT","FATE","FB","FBIO","FBIZ","FBMS","FBNC","FBNK","FBSS","FBZ","FCA","FCAL","FCAN","FCAP","FCBC","FCCO","FCCY","FCEF","FCEL","FCNCA","FCRE","FCSC","FCVT","FDBC","FDEF","FDIV","FDT","FDTS","FDUS","FEIM","FELE","FEM","FEMB","FEMS","FENC","FEP","FEUZ","FEX","FEYE","FFBC","FFBCW","FFBW","FFHL","FFIC","FFIN","FFIV","FFKT","FFNW","FFWM","FGBI","FGEN","FGM","FH","FHB","FHK","FIBK","FINL","FINX","FISI","FISV","FITB","FITBI","FIVE","FIVN","FIXD","FIZZ","FJP","FKO","FKU","FLAG","FLAT","FLDM","FLEX","FLGT","FLIC","FLIR","FLKS","FLL","FLN","FLWS","FLXN","FLXS","FMAO","FMB","FMBH","FMBI","FMCI","FMCIR","FMCIU","FMCIW","FMI","FMK","FMNB","FNBG","FNGN","FNHC","FNJN","FNK","FNLC","FNSR","FNTE","FNTEU","FNTEW","FNWB","FNX","FNY","FOANC","FOGO","FOLD","FOMX","FONE","FONR","FORD","FORK","FORM","FORR","FORTY","FOSL","FOX","FOXA","FOXF","FPA","FPAY","FPRX","FPXI","FRAN","FRBA","FRBK","FRED","FRGI","FRME","FRPH","FRPT","FRSH","FRSX","FRTA","FSAC","FSACU","FSACW","FSAM","FSBC","FSBK","FSBW","FSC","FSCFL","FSCT","FSFG","FSFR","FSLR","FSNN","FSTR","FSV","FSZ","FTA","FTAG","FTC","FTCS","FTD","FTEK","FTEO","FTFT","FTGC","FTHI","FTLB","FTNT","FTR","FTRI","FTRPR","FTSL","FTSM","FTW","FTXD","FTXG","FTXH","FTXL","FTXN","FTXO","FTXR","FULLL","FULT","FUNC","FUND","FUSB","FUV","FV","FVC","FVE","FWONA","FWONK","FWP","FWRD","FYC","FYT","FYX","GABC","GAIA","GAIN","GAINM","GAINN","GAINO","GALE","GALT","GARS","GASS","GBCI","GBDC","GBLI","GBLIL","GBLIZ","GBNK","GBT","GCBC","GCVRZ","GDEN","GDS","GEC","GECC","GECCL","GEMP","GENC","GENE","GENY","GEOS","GERN","GEVO","GFED","GFN","GFNCP","GFNSL","GGAL","GHDX","GIFI","GIGA","GIGM","GIII","GILD","GILT","GLAD","GLADN","GLBL","GLBR","GLBS","GLBZ","GLDD","GLDI","GLMD","GLNG","GLPG","GLPI","GLRE","GLUU","GLYC","GMLP","GMLPP","GNBC","GNCA","GNCMA","GNMA","GNMK","GNMX","GNRX","GNTX","GNTY","GNUS","GOGL","GOGO","GOLD","GOOD","GOODM","GOODO","GOODP","GOOG","GOOGL","GOV","GOVNI","GPAC","GPACW","GPIA","GPIAW","GPIC","GPOR","GPP","GPRE","GPRO","GRBK","GRFS","GRID","GRIF","GRMN","GROW","GRPN","GRVY","GSBC","GSHT","GSHTU","GSHTW","GSIT","GSM","GSUM","GSVC","GT","GTHX","GTIM","GTLS","GTXI","GTYH","GTYHU","GTYHW","GULF","GURE","GWGH","GWPH","GWRS","GYRO","HA","HABT","HAFC","HAIN","HAIR","HALL","HALO","HAS","HAWK","HAYN","HBAN","HBANN","HBANO","HBANP","HBCP","HBHC","HBHCL","HBIO","HBK","HBMD","HBNC","HBP","HCAP","HCAPZ","HCCI","HCKT","HCM","HCOM","HCSG","HDNG","HDP","HDS","HDSN","HEAR","HEBT","HEES","HELE","HEWG","HFBC","HFBL","HFWA","HGSH","HIBB","HIFS","HIHO","HIIQ","HIMX","HLG","HLIT","HLNE","HMHC","HMNF","HMNY","HMST","HMSY","HMTA","HMTV","HNH","HNNA","HNRG","HOFT","HOLI","HOLX","HOMB","HONE","HOPE","HOTR","HOVNP","HPJ","HPT","HQCL","HQY","HRTX","HRZN","HSGX","HSIC","HSII","HSKA","HSNI","HSON","HSTM","HTBI","HTBK","HTBX","HTGM","HTHT","HTLD","HTLF","HUBG","HUNT","HUNTU","HUNTW","HURC","HURN","HVBC","HWBK","HWCC","HWKN","HYACU","HYGS","HYLS","HYND","HYXE","HYZD","HZNP","IAC","IAM","IAMXR","IAMXU","IAMXW","IART","IBB","IBCP","IBKC","IBKCO","IBKCP","IBKR","IBOC","IBTX","IBUY","ICAD","ICBK","ICCC","ICCH","ICFI","ICHR","ICLN","ICLR","ICON","ICPT","ICUI","IDCC","IDLB","IDRA","IDSA","IDSY","IDTI","IDXG","IDXX","IEF","IEI","IEP","IESC","IEUS","IFEU","IFGL","IFMK","IFON","IFV","IGF","IGLD","IGOV","III","IIIN","IIJI","IIN","IIVI","IJT","IKNX","ILG","ILMN","IMDZ","IMGN","IMI","IMKTA","IMMR","IMMU","IMMY","IMNP","IMOS","IMPV","IMRN","IMRNW","IMTE","INAP","INBK","INBKL","INCR","INCY","INDB","INDU","INDUU","INDUW","INDY","INFI","INFN","INFO","INFR","INGN","INO","INOD","INOV","INPX","INSE","INSG","INSM","INSY","INTC","INTG","INTL","INTU","INTX","INVA","INVE","INWK","IONS","IOSP","IOTS","IOVA","IPAR","IPAS","IPCC","IPCI","IPDN","IPGP","IPHS","IPKW","IPWR","IPXL","IRBT","IRCP","IRDM","IRDMB","IRIX","IRMD","IROQ","IRTC","IRWD","ISBC","ISCA","ISHG","ISIG","ISM","ISNS","ISRG","ISRL","ISSC","ISTB","ISTR","ITCI","ITEK","ITI","ITIC","ITRI","ITRN","ITUS","IUSB","IUSG","IUSV","IVAC","IVTY","IXUS","IXYS","IZEA","JACK","JAGX","JAKK","JASN","JASNW","JASO","JAZZ","JBHT","JBLU","JBSS","JCOM","JCS","JCTCF","JD","JJSF","JKHY","JKI","JMBA","JMU","JNCE","JNP","JOBS","JOUT","JRJC","JRVR","JSM","JSMD","JSML","JSYN","JSYNR","JSYNU","JSYNW","JTPY","JUNO","JVA","JXSB","JYNT","KAAC","KAACU","KAACW","KALA","KALU","KALV","KANG","KBAL","KBLM","KBLMR","KBLMU","KBLMW","KBSF","KBWB","KBWD","KBWP","KBWR","KBWY","KCAP","KCAPL","KE","KELYA","KELYB","KEQU","KERX","KEYW","KFFB","KFRC","KGJI","KHC","KIDS","KIN","KINS","KIRK","KLAC","KLIC","KLXI","KMDA","KMPH","KNDI","KNSL","KONA","KONE","KOOL","KOPN","KOSS","KPTI","KRMA","KRNT","KRNY","KRYS","KTCC","KTEC","KTOS","KTOV","KTOVW","KTWO","KURA","KVHI","KWEB","LABL","LAKE","LALT","LAMR","LANC","LAND","LANDP","LARK","LAUR","LAWS","LAYN","LBAI","LBIX","LBRDA","LBRDK","LBTYA","LBTYB","LBTYK","LCA","LCAHU","LCAHW","LCNB","LCUT","LDRI","LE","LECO","LEDS","LENS","LEXEA","LEXEB","LFUS","LFVN","LGCY","LGCYO","LGCYP","LGIH","LGND","LHCG","LIFE","LILA","LILAK","LINC","LIND","LINDW","LINK","LINU","LION","LITE","LIVE","LIVN","LJPC","LKFN","LKOR","LKQ","LLIT","LLNW","LMAT","LMB","LMBS","LMFA","LMFAW","LMNR","LMNX","LMOS","LMRK","LMRKO","LMRKP","LNCE","LNDC","LNGR","LNTH","LOAN","LOB","LOCO","LOGI","LOGM","LONE","LOPE","LORL","LOXO","LPCN","LPLA","LPNT","LPSN","LPTH","LPTX","LQDT","LRAD","LRCX","LRGE","LSBK","LSCC","LSTR","LSXMA","LSXMB","LSXMK","LTBR","LTEA","LTRPA","LTRPB","LTRX","LTXB","LULU","LUNA","LVHD","LVNTA","LWAY","LXRX","LYL","LYTS","MACK","MACQ","MACQU","MACQW","MAGS","MAMS","MANH","MANT","MAR","MARA","MARK","MARPS","MASI","MAT","MATR","MATW","MAYS","MB","MBB","MBCN","MBFI","MBFIP","MBII","MBIN","MBIO","MBOT","MBRX","MBSD","MBTF","MBUU","MBVX","MBWM","MCBC","MCEF","MCEP","MCFT","MCHI","MCHP","MCHX","MCRB","MCRI","MDB","MDCA","MDCO","MDGL","MDGS","MDIV","MDLZ","MDRX","MDSO","MDVX","MDVXW","MDWD","MDXG","MEDP","MEET","MEIP","MELI","MELR","MEOH","MERC","MESO","METC","MFIN","MFINL","MFNC","MFSF","MGCD","MGEE","MGEN","MGI","MGIC","MGLN","MGNX","MGPI","MGRC","MGYR","MHLD","MICT","MICTW","MIDD","MIII","MIIIU","MIIIW","MIK","MILN","MIME","MIND","MINDP","MINI","MITK","MITL","MKSI","MKTX","MLAB","MLCO","MLHR","MLNK","MLNX","MLVF","MMAC","MMDM","MMDMR","MMDMU","MMDMW","MMLP","MMSI","MMYT","MNDO","MNGA","MNKD","MNOV","MNRO","MNST","MNTA","MNTX","MOBL","MOFG","MOMO","MORN","MOSY","MOXC","MPAA","MPAC","MPACU","MPACW","MPB","MPCT","MPVD","MPWR","MRAM","MRCC","MRCY","MRDN","MRDNW","MRLN","MRNS","MRSN","MRTN","MRTX","MRUS","MRVL","MSBF","MSBI","MSCC","MSDI","MSDIW","MSEX","MSFG","MSFT","MSON","MSTR","MTBC","MTBCP","MTCH","MTEM","MTEX","MTFB","MTFBW","MTGE","MTGEP","MTLS","MTP","MTRX","MTSC","MTSI","MTSL","MU","MVIS","MXIM","MXPT","MXWL","MYGN","MYL","MYND","MYNDW","MYOK","MYOS","MYRG","MYSZ","MZOR","NAII","NAKD","NANO","NAOV","NATH","NATI","NATR","NAUH","NAVG","NAVI","NBEV","NBIX","NBN","NBRV","NBTB","NCBS","NCLH","NCMI","NCNA","NCOM","NCSM","NCTY","NDAQ","NDLS","NDRA","NDRAW","NDRM","NDSN","NEO","NEOG","NEON","NEOS","NEOT","NEPT","NERV","NESR","NESRW","NETE","NEWA","NEWS","NEWT","NEWTL","NEWTZ","NEXT","NEXTW","NFBK","NFEC","NFLX","NGHC","NGHCN","NGHCO","NGHCP","NGHCZ","NH","NHLD","NHLDW","NHTC","NICE","NICK","NIHD","NITE","NK","NKSH","NKTR","NLNK","NLST","NMIH","NMRX","NNBR","NNDM","NODK","NOVN","NOVT","NRCIA","NRCIB","NRIM","NSEC","NSIT","NSSC","NSTG","NSYS","NTAP","NTCT","NTEC","NTES","NTGR","NTIC","NTLA","NTNX","NTRA","NTRI","NTRP","NTRS","NTRSP","NTWK","NUAN","NURO","NUROW","NUVA","NVAX","NVCN","NVCR","NVDA","NVEC","NVEE","NVFY","NVGN","NVIV","NVLN","NVMI","NVTR","NVUS","NWBI","NWFL","NWLI","NWPX","NWS","NWSA","NXEO","NXEOU","NXEOW","NXPI","NXST","NXTD","NXTDW","NXTM","NYMT","NYMTN","NYMTO","NYMTP","NYMX","NYNY","OACQ","OACQR","OACQU","OACQW","OASM","OBAS","OBCI","OBLN","OBSV","OCC","OCFC","OCLR","OCRX","OCSI","OCSL","OCSLL","OCUL","ODFL","ODP","OESX","OFED","OFIX","OFLX","OFS","OHAI","OHGI","OHRP","OIIM","OKSB","OKTA","OLBK","OLD","OLED","OLLI","OMAB","OMCL","OMED","OMER","OMEX","OMNT","ON","ONB","ONCE","ONCS","ONEQ","ONS","ONSIW","ONSIZ","ONTX","ONTXW","ONVI","ONVO","OPB","OPGN","OPGNW","OPHC","OPHT","OPK","OPNT","OPOF","OPTN","OPTT","ORBC","ORBK","OREX","ORG","ORIG","ORIT","ORLY","ORMP","ORPN","ORRF","OSBC","OSBCP","OSIS","OSN","OSPR","OSPRU","OSPRW","OSTK","OSUR","OTEL","OTEX","OTIC","OTIV","OTTR","OTTW","OVAS","OVBC","OVID","OVLY","OXBR","OXBRW","OXFD","OXLC","OXLCM","OXLCO","OZRK","PAAS","PACB","PACW","PAGG","PAHC","PANL","PATI","PATK","PAVM","PAVMW","PAYX","PBBI","PBCT","PBCTP","PBHC","PBIB","PBIP","PBMD","PBNC","PBPB","PBSK","PBYI","PCAR","PCBK","PCH","PCLN","PCMI","PCO","PCOM","PCRX","PCSB","PCTI","PCTY","PCYG","PCYO","PDBC","PDCE","PDCO","PDEX","PDFS","PDLB","PDLI","PDP","PDVW","PEBK","PEBO","PEGA","PEGI","PEIX","PENN","PERI","PERY","PESI","PETQ","PETS","PETX","PETZ","PEY","PEZ","PFBC","PFBI","PFBX","PFF","PFI","PFIE","PFIN","PFIS","PFLT","PFM","PFMT","PFPT","PFSW","PGC","PGJ","PGLC","PGNX","PHII","PHIIK","PHMD","PHO","PI","PICO","PID","PIE","PIH","PINC","PIO","PIRS","PIXY","PIZ","PKBK","PKOH","PKW","PLAB","PLAY","PLBC","PLCE","PLPC","PLPM","PLSE","PLUG","PLUS","PLW","PLXP","PLXS","PLYA","PMBC","PMD","PME","PMPT","PMTS","PNBK","PNFP","PNK","PNNT","PNQI","PNRG","PNTR","PODD","POLA","POOL","POPE","POWI","POWL","PPBI","PPC","PPH","PPHM","PPHMP","PPIH","PPSI","PRAA","PRAH","PRAN","PRCP","PRFT","PRFZ","PRGS","PRGX","PRIM","PRKR","PRMW","PRN","PROV","PRPH","PRPO","PRQR","PRSC","PRSS","PRTA","PRTK","PRTO","PRTS","PSAU","PSC","PSCC","PSCD","PSCE","PSCF","PSCH","PSCI","PSCM","PSCT","PSCU","PSDO","PSDV","PSEC","PSET","PSL","PSMT","PSTB","PSTI","PTC","PTCT","PTEN","PTF","PTGX","PTH","PTI","PTIE","PTLA","PTNR","PTSI","PTX","PUB","PUI","PULM","PVAC","PVBC","PWOD","PXI","PXLW","PXS","PY","PYDS","PYPL","PYZ","PZRX","PZZA","QABA","QADA","QADB","QAT","QBAK","QCLN","QCOM","QCRH","QDEL","QGEN","QINC","QIWI","QLC","QLYS","QNST","QQEW","QQQ","QQQC","QQQX","QQXT","QRHC","QRVO","QSII","QTEC","QTNA","QTNT","QTRH","QUIK","QUMU","QURE","QVCA","QVCB","QYLD","RADA","RAIL","RAND","RARE","RARX","RAVE","RAVN","RBB","RBCAA","RBCN","RBPAA","RCII","RCKY","RCM","RCMT","RCON","RDCM","RDFN","RDHL","RDI","RDIB","RDNT","RDUS","RDVY","RDWR","RECN","REDU","REFR","REGI","REGN","REIS","RELL","RELV","RELY","REPH","RESN","RETA","REXX","RFAP","RFDI","RFEM","RFEU","RFIL","RGCO","RGEN","RGLD","RGLS","RGNX","RGSE","RIBT","RIBTW","RICK","RIGL","RILY","RILYL","RILYZ","RING","RIOT","RKDA","RLJE","RLOG","RMBL","RMBS","RMCF","RMGN","RMNI","RMNIU","RMNIW","RMR","RMTI","RNDB","RNDM","RNDV","RNEM","RNET","RNLC","RNMC","RNSC","RNST","RNVA","RNVAZ","RNWK","ROBO","ROCK","ROIC","ROKA","ROKU","ROLL","ROSE","ROSEU","ROSEW","ROSG","ROST","RP","RPD","RPRX","RPXC","RRGB","RRR","RSLS","RSYS","RTIX","RTK","RTNB","RTRX","RTTR","RUN","RUSHA","RUSHB","RUTH","RVEN","RVLT","RVNC","RVSB","RWLK","RXDX","RXII","RXIIW","RYAAY","RYTM","SABR","SAEX","SAFM","SAFT","SAGE","SAIA","SAL","SALM","SAMG","SANM","SANW","SASR","SATS","SAUC","SAVE","SBAC","SBBP","SBBX","SBCF","SBCP","SBFG","SBFGP","SBGI","SBLK","SBLKL","SBNY","SBNYW","SBOT","SBPH","SBRA","SBRAP","SBSI","SBUX","SCAC","SCACU","SCACW","SCHL","SCHN","SCKT","SCLN","SCMP","SCON","SCSC","SCSS","SCVL","SCWX","SCYX","SCZ","SEAC","SECO","SEDG","SEED","SEIC","SELB","SELF","SENEA","SENEB","SFBC","SFBS","SFLY","SFM","SFNC","SFST","SGBX","SGC","SGEN","SGH","SGLB","SGLBW","SGMA","SGMO","SGMS","SGOC","SGQI","SGRP","SGRY","SGYP","SHBI","SHEN","SHIP","SHIPW","SHLD","SHLDW","SHLM","SHLO","SHOO","SHOS","SHPG","SHSP","SHV","SHY","SIEB","SIEN","SIFI","SIFY","SIGI","SIGM","SILC","SIMO","SINA","SINO","SIR","SIRI","SITO","SIVB","SIVBO","SKIS","SKLN","SKOR","SKYS","SKYW","SKYY","SLAB","SLCT","SLGN","SLIM","SLM","SLMBP","SLNO","SLNOW","SLP","SLQD","SLRC","SLVO","SMBC","SMBK","SMCI","SMCP","SMED","SMIT","SMMF","SMMT","SMPL","SMPLW","SMRT","SMSI","SMTC","SMTX","SNAK","SNBC","SNBR","SNC","SNCR","SND","SNDE","SNDX","SNES","SNFCA","SNGX","SNGXW","SNH","SNHNI","SNHNL","SNHY","SNI","SNLN","SNMX","SNNA","SNOA","SNOAW","SNPS","SNSR","SNSS","SOCL","SODA","SOFO","SOHO","SOHOB","SOHOM","SOHOO","SOHU","SONA","SONC","SONS","SORL","SOXX","SP","SPAR","SPCB","SPEX","SPHS","SPI","SPIL","SPKE","SPKEP","SPLK","SPNE","SPNS","SPOK","SPPI","SPRO","SPRT","SPSC","SPTN","SPWH","SPWR","SQBG","SQLV","SQQQ","SQZZ","SRAX","SRCE","SRCL","SRCLP","SRDX","SRET","SREV","SRNE","SRPT","SRRA","SRTS","SRTSW","SRUN","SRUNU","SRUNW","SSB","SSBI","SSC","SSFN","SSKN","SSNC","SSNT","SSRM","SSTI","SSYS","STAA","STAF","STB","STBA","STBZ","STDY","STFC","STKL","STKS","STLD","STLR","STLRW","STLY","STML","STMP","STPP","STRA","STRL","STRM","STRS","STRT","STX","SUMR","SUNS","SUNW","SUPN","SUSB","SUSC","SVA","SVBI","SVRA","SVVC","SWIN","SWIR","SWKS","SYBT","SYBX","SYKE","SYMC","SYMX","SYNA","SYNC","SYNL","SYNT","SYPR","SYRS","TA","TACO","TACOW","TACT","TAIT","TANH","TANNI","TANNL","TANNZ","TAPR","TAST","TATT","TAX","TAYD","TBBK","TBK","TBNK","TBPH","TCBI","TCBIL","TCBIP","TCBK","TCCO","TCFC","TCGP","TCMD","TCON","TCPC","TCRD","TCX","TDIV","TEAM","TEAR","TECD","TECH","TEDU","TELL","TENX","TERP","TESO","TESS","TFSL","TGA","TGEN","TGLS","TGTX","THFF","THRM","THST","TICC","TICCL","TIG","TIL","TILE","TIPT","TISA","TITN","TIVO","TLF","TLGT","TLND","TLT","TMUS","TMUSP","TNAV","TNDM","TNTR","TNXP","TOCA","TOPS","TORM","TOUR","TOWN","TPIC","TPIV","TQQQ","TRCB","TRCH","TREE","TRHC","TRIB","TRIL","TRIP","TRMB","TRMK","TRMT","TRNC","TRNS","TROV","TROW","TRPX","TRS","TRST","TRUE","TRUP","TRVG","TRVN","TSBK","TSC","TSCO","TSEM","TSG","TSLA","TSRI","TSRO","TST","TTD","TTEC","TTEK","TTGT","TTMI","TTNP","TTOO","TTPH","TTS","TTWO","TUES","TUR","TURN","TUSA","TUSK","TVIX","TVIZ","TVTY","TWIN","TWMC","TWNK","TWNKW","TWOU","TXMD","TXN","TXRH","TYHT","TYME","TYPE","TZOO","UAE","UBCP","UBFO","UBIO","UBNK","UBNT","UBOH","UBSH","UBSI","UCBA","UCBI","UCFC","UCTT","UDBI","UEIC","UEPS","UFCS","UFPI","UFPT","UG","UGLD","UHAL","UIHC","ULBI","ULH","ULTA","ULTI","UMBF","UMPQ","UNAM","UNB","UNFI","UNIT","UNTY","UONE","UONEK","UPL","UPLD","URBN","URGN","USAK","USAP","USAT","USATP","USAU","USCR","USEG","USLB","USLM","USLV","USMC","USOI","UTHR","UTMD","UTSI","UVSP","VALU","VALX","VBFC","VBIV","VBLT","VBND","VBTX","VCEL","VCIT","VCLT","VCSH","VCYT","VDSI","VDTH","VEAC","VEACU","VEACW","VECO","VEON","VERI","VERU","VGIT","VGLT","VGSH","VIA","VIAB","VIAV","VICL","VICR","VIDI","VIGI","VIIX","VIIZ","VIRC","VIRT","VIVE","VIVO","VKTX","VKTXW","VLGEA","VLRX","VMBS","VNDA","VNET","VNOM","VNQI","VOD","VONE","VONG","VONV","VOXX","VRA","VRAY","VREX","VRIG","VRML","VRNA","VRNS","VRNT","VRSK","VRSN","VRTS","VRTSP","VRTU","VRTX","VSAR","VSAT","VSDA","VSEC","VSMV","VSTM","VTGN","VTHR","VTIP","VTL","VTNR","VTVT","VTWG","VTWO","VTWV","VUSE","VUZI","VVPR","VVUS","VWOB","VWR","VXUS","VYGR","VYMI","WABC","WAFD","WAFDW","WASH","WATT","WAYN","WB","WBA","WBB","WBKC","WCFB","WDAY","WDC","WDFC","WEB","WEBK","WEN","WERN","WETF","WEYS","WFBI","WHF","WHFBL","WHLM","WHLR","WHLRD","WHLRP","WHLRW","WIFI","WILC","WIN","WINA","WING","WIRE","WIX","WKHS","WLB","WLDN","WLFC","WLTW","WMGI","WMGIZ","WMIH","WNEB","WOOD","WPCS","WPPGY","WPRT","WRLD","WRLS","WRLSR","WRLSU","WRLSW","WSBC","WSBF","WSCI","WSFS","WSTC","WSTG","WSTL","WTBA","WTFC","WTFCM","WTFCW","WVE","WVFC","WVVI","WVVIP","WWD","WWR","WYIG","WYIGU","WYIGW","WYNN","XBIO","XBIT","XBKS","XCRA","XELA","XELB","XENE","XENT","XGTI","XGTIW","XIV","XLNX","XLRN","XNCR","XNET","XOG","XOMA","XONE","XPER","XPLR","XRAY","XT","XTLB","YDIV","YECO","YERR","YGYI","YIN","YLCO","YLDE","YNDX","YOGA","YORW","YRCW","YTEN","YTRA","YY","Z","ZAGG","ZAIS","ZBIO","ZBRA","ZEAL","ZEUS","ZFGN","ZG","ZGNX","ZION","ZIONW","ZIOP","ZIV","ZIXI","ZKIN","ZLAB","ZN","ZNGA","ZSAN","ZUMZ","ZYNE"];