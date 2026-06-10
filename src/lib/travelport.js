export async function searchTravelportFlights(origin, destination, departureDate) {
  const url = '/B2BGateway/connect/uAPI/AirService';
  const authHeader = 'Basic VW5pdmVyc2FsIEFQSS91QVBJNjc3NjMxNjEyNy00NDUwZjNjMjo5ZiZRclgyIUdf';

  // Strict Date validation (YYYY-MM-DD)
  let safeDate = departureDate;
  if (!safeDate || safeDate.trim() === '') {
     const d = new Date();
     d.setDate(d.getDate() + 1);
     safeDate = d.toISOString().split('T')[0];
  }

  const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:air="http://www.travelport.com/schema/air_v54_0" xmlns:com="http://www.travelport.com/schema/common_v54_0">
    <soapenv:Header/>
    <soapenv:Body>
        <LowFareSearchReq xmlns="http://www.travelport.com/schema/air_v54_0" TraceId="63beed3a-178e-4993-b357-6295aaa2c64d" TargetBranch="P7025891" ReturnUpsellFare="true">
            <BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v54_0" OriginApplication="uAPI"/>
            <SearchAirLeg>
                <SearchOrigin>
                    <CityOrAirport xmlns="http://www.travelport.com/schema/common_v54_0" Code="${origin}" PreferCity="true"/>
                </SearchOrigin>
                <SearchDestination>
                    <CityOrAirport xmlns="http://www.travelport.com/schema/common_v54_0" Code="${destination}" PreferCity="true"/>
                </SearchDestination>
                <SearchDepTime PreferredTime="${safeDate}"/>
                <AirLegModifiers>
                    <PreferredCabins>
                        <CabinClass xmlns="http://www.travelport.com/schema/common_v54_0" Type="Economy"/>
                    </PreferredCabins>
                </AirLegModifiers>
            </SearchAirLeg>
            <AirSearchModifiers>
                <PreferredProviders>
                    <Provider xmlns="http://www.travelport.com/schema/common_v54_0" Code="1G"/>
                </PreferredProviders>
                <FlightType NonStopDirects="true"/>
            </AirSearchModifiers>
            <SearchPassenger xmlns="http://www.travelport.com/schema/common_v54_0" Code="ADT"/>
            <AirPricingModifiers>
                <AccountCodes>
                    <AccountCode xmlns="http://www.travelport.com/schema/common_v54_0" Code="-"/>
                </AccountCodes>
            </AirPricingModifiers>
        </LowFareSearchReq>
    </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authorization': authHeader,
        'content-type': 'text/xml;charset=UTF-8',
        'accept': 'text/xml',
        'SOAPAction': '""'
      },
      body: xmlBody
    });

    if (!response.ok) {
      console.error("Travelport API Error:", response.statusText);
      return { error: true, text: `API Error: ${response.statusText}` };
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Handle SOAP Faults
    const fault = xmlDoc.getElementsByTagNameNS("*", "Fault");
    if (fault.length > 0) {
      const faultString = xmlDoc.getElementsByTagNameNS("*", "faultstring")[0]?.textContent || "Unknown SOAP Error";
      return { error: true, text: faultString };
    }

    // Extract AirPricingSolution nodes
    const solutions = xmlDoc.getElementsByTagNameNS("*", "AirPricingSolution");
    
    if (solutions.length === 0) {
      return { error: false, flights: [] };
    }

    const flights = [];
    
    // Parse top 3 options
    for (let i = 0; i < Math.min(solutions.length, 3); i++) {
      const sol = solutions[i];
      const totalPrice = sol.getAttribute("TotalPrice") || "N/A";
      
      const segments = sol.getElementsByTagNameNS("*", "AirSegment");
      let airline = "Unknown";
      let flightNum = "000";
      let depTime = "";
      let arrTime = "";
      
      if (segments.length > 0) {
        const seg = segments[0];
        airline = seg.getAttribute("Carrier") || "Unknown";
        flightNum = seg.getAttribute("FlightNumber") || "000";
        depTime = seg.getAttribute("DepartureTime") || "";
        arrTime = seg.getAttribute("ArrivalTime") || "";
        
        if (depTime) depTime = new Date(depTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        if (arrTime) arrTime = new Date(arrTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
      
      flights.push({
        id: 'tp_' + i,
        airline: airline,
        flightNumber: flightNum,
        departureTime: depTime,
        arrivalTime: arrTime,
        price: totalPrice,
        origin,
        destination
      });
    }

    return { error: false, flights };

  } catch (err) {
    console.error("Fetch Error:", err);
    return { error: true, text: err.message };
  }
}
