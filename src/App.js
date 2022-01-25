import "./index.css";
import React, { useState, useEffect } from "react";

import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useSpeechSynthesis } from "react-speech-kit";

const axios = require("axios");
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
function App() {
  const onEnd = () => {
    setIsSpeaking((isSpeaking) => false);
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });
  const [statusText, setStatusText] = useState(
    "Your results will be shown here"
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [desiredIntent, setDesiredIntent] = useState("");

  const speechConfig = speechsdk.SpeechConfig.fromSubscription(
    "e4d43c65621641c3b4bcd80c978d9d58",
    "southeastasia"
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();

  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
  const descriptions = {
    GoActiveSG: "You can go to the ActiveSG Park",
    GoClusiaCove: "You can go to Clusia Cove",
    GoForestRamble: "You can go to Forest Ramble",
    GoNeramStreams: "You can go to Neram Streams",
    GoPassionWave: "You can go to Passion Wave",
    None: "I am sorry, but I could not understand your question.",
    GoRasauWalk: "You can go to Rasau Walk",
    IntroSelf: "Hello, I am here to guide you around Jurong Lake Gardens",
    JLG_Map: "You may refer to the jurong lake garden map to get to your destination.",
    Fishing: "Fishing is only allowed in designated fishing areas in some of our parks, please look out for signboards if you are permitted.",
    Camping: "Camping in our parks is a recreational option for Singapore residents, and is allowed in designated areas. Camping areas in our parks are in East Coast Park, Pasir ris park and West Coast Park camping areas, permits are required.",
    WearMask: "You are required to wear a mask except when engaging in strenuous exercise, such as running, cycling, brisk walking, and walking in hilly terrain. For more information, please visit our website at www.nparks.gov.sg/noticeboard.",
    Cycling: "You are welcome to cycle along our park connectors, or in parks with designated cycling tracks and trails. Please give way to pedestrians on footpath and shared paths.",
    BookVenue: "In line with latest announcement by the Multi-Ministry TaskForce (MTF) for Phase Two, function spaces will be reopened for wedding solemnisations, subjected to a cap of 20 persons. We are unable to accomodate books for other events and activities until further notice. For more information on latest advisories in response to covid-19 situation, please visit our website at www.nparks.gov.sg/noticeboard.",
    HoursLakeside: "Lakeside Garden is opened 24 hours.",
    HoursDogRun: "The Dog Run is opened daily from 8am to 10pm.",
    HoursClusiaCove: "Clusia Cove is opened from 8 am to 7 pm every day except Mondays and Public Holidays.",
    HoursForestRamble: "Forest Ramble is opened to public from 8am to 10pm and closed on Mondays except Public Holidays.",
    HoursChineseJapanese: "Chinese Garden and Japanese Garden will be opened in phases from 2023.",
    CarparkCharges: "The carpark charges are as follows:\n\nMondays to Fridays:\n\n5am to 8.30pm (Free Parking)\n8.30am to 12 pm ($0.60/30 mins)\n12pm to 2pm (Free Parking)\n2pm to 5am ($0.60/30 mins)\n\nSaturdays, Sundays, and Public Holidays:\n\n8.30am to 5am ($0.60/30 mins)",
    CarparkLots: "North Carpark:\n\nTotal Parking Lots: 175\nHandicap Lots: 2\nMotorcycle Lots: 15\n\nSouth Carpark:\n\nTotal Parking Lots: 175\nHandicap Lots: 4\nMotorcycle Lots: 11\nBus Bay: 5",
    CarparkAccessibility: "Drivers with mobility impairment (Class 1 Label)\n\nPassengers with mobility impairment (Class 2 Label)\n(After which, the driver has to move the vehicle to a standard parking lot)\n\n**A mobility impairment is a disability that affects movement ranging from gross motor skills, such as walking, to fine motor movement, involving manipulation of objects by hand.",
    CarparkLocations: "There are a total of two carparks in the Gardens. One is located in the South while the other in the North.",
    GeneralDogsAllowed: "Dogs are allowed in the Gardens. Dogs can run free and unleashed at the dog run. However, all dogs should be leash outside of the dog run premises. Dog owners are required to clean up after them should their dogs defecate in public. ",
    GeneralSmoking: "Jurong Lake Gardens is a smoke-free gardens. Let’s keep our gardens smoke-free for everyone to enjoy.",
    GeneralChineseJapanese: "Yes, Chinese and Japanese Garden is a part of the Gardens.",
    GeneralShuttle: "The Gardens does not provide any shuttle services to nearby malls. However, you can take a 10-minute walk to Lakeside MRT from the North of the Gardens to nearby malls. ",
    GeneralTransport: "The nearest bus services are 49 and 154 near the South of the Gardens. Alternatively, you can take a 10-minute walk to Lakeside MRT from the North of the Gardens. ",
    GeneralWalk: "The entire walk from the North to the South of Lakeside Garden is 7km.",
    GeneralMap: "The map of the Gardens can be found at the Entrance Pavilion and along the entrances/exits of the Gardens. ",
    GeneralAED: "Automated External Defribillator (AED) can be found at Southern Promenade, South Carpark Shelter, Gardenhouse Lobby, Forest Ramble – Toilet Block, Entrance Pavilion, Passion Wave and Clusia Cove Water Play.",
    GeneralDropoff: "The drop-off/pick-up points are located at the North Carpark at Entrance Pavilion and the South Carpark of the Gardens. ",
    GeneralViewingDecks: "Viewing Decks can be found opposite the F&B outlet – Fusion Spoon and near the Southern Promenade. ",
    GeneralBirdHides: "There are three bird hides in the Gardens. The bird hides can be found near the South Carpark of the Gardens. ",
    GeneralLoneTreeLocation: "The Lone Tree can be found after a short walk across the Grasslands. The nearest entrance to it would be from the South Carpark. ",
    GeneralLoneTreeInfo: "The Lone Tree is a sculpture made from recycled iron reinforcement bars salvaged from the old park’s path. ",
    GeneralEvents: "The Gardens do host events such as Bazaar in the Garden and Mid-Autumn Festival etc.\n\nFor more details, please head over to https://www.nparks.gov.sg/juronglakegardens/whats-happening/calendar-of-events",
    GeneralDogsSafety: "This is for the safety of your pet as we have vehicles moving in the Gardens and to be considerate to other visitors. ",
    GeneralLostAndFound: "You may bring the lost child/unaccompanied person to the visitor services counter at the Entrance Pavilion. Our officers will take over from there. Lost and found can also be turned in at the visitor services counter. ",
    ActivitiesFlying: "Flying of drones and kites are prohibited in the Gardens. Parts of Jurong Lake Gardens are located within CAAS “No-fly zone” due to proximity to Tengah Airbase.",
    ActivitiesPermit: "Kindly submit an application via CAAS. NParks will evaluate on a case-by-case basis.",
    ActivitiesPicnic: "Yes, a simple mat is allowed in the Gardens. However, no set ups of tables, chairs and likes are allowed. Visitors will be required to clean up after the picnic.\n\nOne can set up a picnic at designated lawns and grass areas. Designated lawns: The Oval, Butterfly Field, Lakeside Field. NO picnic is allowed at Grasslands.",
    ActivitiesFitness: "There are two fitness corners in Jurong Lake Gardens. The fitness corners are located at the ActiveSG Park and near the BBQ pits.",
    ActivitiesFishing: "Fishing is permitted only at designated fishing area at Southern Promenade",
    ActivitiesCycling: "Cycling is allowed on the main path of Lakeside Garden in Jurong Lake Gardens. However, for the safety of all visitors, we request that all cyclists give way to pedestrians, and keep left when on a shared track.\n\nDo note that cycling is not allowed at certain locations like the Grasslands, Rasau Walk, ABC Waters at Jurong Lake, and areas with ‘Dismount and Push’ signs.",
    ActivitiesSkating: "Skating/Kick scooter is allowed on the main path at the Gardens. However, do skate and kick scooter at a safe speed to prevent accidents on the shared track.\n\nSkating is not allowed on Rasau Walk as it is a meandering boardwalk along the water’s edge.	",
    ActivitiesRollerblading: "Rollerblading is allowed on the main path at the Gardens. However, do rollerblade at a safe speed to prevent accidents on the shared track.\n\nRollerblading is not allowed on Rasau Walk as it is a meandering boardwalk along the water’s edge.",
    ActivitiesSparkles: "No open fires are allowed in the Gardens to ensure the safety of the public and plants.",
    ActivitiesLantern: "Lanterns lighted with candles are not allowed in the Gardens. However, LED lit lanterns are allowed. ",
    ActivitiesCamping: "Camping or use of tents is not permitted in Jurong Lake Gardens.\n\nYou may camp at designated camping sites such as East Coast Park, Pasir Ris Park, West Coast Park and Pulau Ubin, subject to the current COVID-19 advisories.\n\nFor more information on camping at our parks and gardens, you may refer to the website: https://www.nparks.gov.sg/activities/fun-and-recreation/camping ",
    ActivitiesSoccer: "Recreational soccer/football (i.e., does not involve setting up of equipment such as cones, markers, or goalposts) is permitted in the Gardens, if conducted in a safe manner. However, organised soccer/football sessions are discouraged, for the safety of other visitors to the Gardens.",
    ActivitiesFrisbee: "Recreational frisbee (i.e., does not involve setting up of equipment such as cones, markers, or goalposts) is permitted, if conducted in a safe manner. However, organised frisbee sessions are discouraged, for the safety of other visitors.",
    ActivitiesSoftball: "For the safety of other visitors, softball is strongly discouraged, as it involves a fast-moving projectile.",
    ActivitiesPMD: "Use of PMDs is allowed on park connectors in Jurong Lake Gardens. Park connectors are labelled with “PCN Round Island Route” imprints on the ground.",
    FnBLocation: "There is currently one food establishment in the Gardens – Fusion Spoon.\n\nMonday to Friday: 10 am to 10 pm\nSaturday and Sunday: 7 am to 10 pm",
    FnBVending: "Vending machines can be found at ActiveSG Park, Gardenhouse, Play Pavilion and Clusia Cove Pavilion.\n\nVending machines dispensing hot food can be found at Gardenhouse and Forest Ramble",
    FnBHalal: "Fusion Spoon, located in Lakeside Garden, is open daily, from 10.00am to 10.00pm on Monday - Friday, and from 7.00am to 10.00pm on Saturday and Sunday (Subject to prevailing COVID-19 Safe Management Measures). It is halal certified.\n\nIn addition, there are vending machines selling light snacks and drinks at the Entrance Pavilion, Clusia Cove, Play Pavilion, Gardenhouse, ActiveSGPark and PAssion WaVe.",
    FacilitiesToilets: "Toilets are located at Fusion Spoon, Clusia Cove Pavilion, PAssion WaVe, Play Pavilion, Gardenhouse and ActiveSG Park.\n\nHandicapped toilets can be found at ActiveSG Park, Gardenhouse, Clusia Cove Pavilion, PAssion WaVe and Play Pavilion.",
    FacilitiesCharging: "One can rent a portable charger from the charging station located in the food and business outlet – Fusion Spoon. ",
    FacilitiesNursing: "Nursing rooms can be found at Gardenhouse, PAssion WaVe and Clusia Cove Pavilion. ",
    FacilitiesCoolers: "Water coolers/ Drinking fountains can be found at Clusia Cove Pavilion, Play Pavilion, Gardenhouse and at selected shelters along the foot path of the Gardens.",
    FacilitiesBBQ: "There are three rentable BBQ pits in the Gardens. However, they are close in the meantime. ",
    FacilitiesLockers: "Lockers are available at Forest Ramble, Play Pavilion. There are no charges for locker usage.",
    FacilitiesAllotment: "Registration for the allotment plots at the Jurong Lake Gardens has been closed and all plots have been allocated. The current tenure for the Allotment Gardens at Jurong Lake Gardens will end in late April 2022.\n\nOnline registration of Allotment Gardens will re-open when plots become available (i.e. new Allotment Gardens, withdrawal by existing gardeners etc.). Please check www.nparks.gov.sg/gardening/allotment-gardens for the latest updates on available Allotment Gardens lots and details on registration procedures.",
    FacilitiesActivities: "One can do sports activities at ActiveSG Park and PAssion WaVe. As for kids play, one can visit Forest Ramble, Water Play at Clusia Cove and Therapeutic Garden. ",
    FacilitiesRentals: "The Gardens do not offer bicycle/rollerblade rentals. ",
    FacilitiesEvents: "Rentable function/event rooms can be found within the Gardens. For more details, please visit https://www.nparks.gov.sg/juronglakegardens/connect-with-us/venue-hire ",
    PlantRemoving: "Damaging or removing plants or parts of plants are not permitted. Under the Parks and Trees Act, it is an offence to cut, collect or displace and plant in the Gardens.\n\nOffenders can be fined up to $5,000. ",
    PlantHarvesting: "The public is not allowed to harvest from state land managed by NParks or Singapore Land Authority (SLA).",
    PlantCollecting: "Individuals and groups who wish to collect seeds, cuttings or fruits for research, education, propagation, charity, or other purposes should approach NParks for permission. ",
    WildlifeFeeding: "Kindly refrain from feeding wildlife as this can affect their health and alter their natural behaviour. ",
    WildlifeReleasing: "Kindly refrain from releasing animals into the Gardens. Doing so may upset out fragile ecosystem and cause more harm than good. ",
    WildlifeSnake: "Do stay calm and back away slowly if you encounter a snake.\n\nDo observe the snake from afar.\n\nDo keep you dog on a tight leash.\n\nDo not try to handle the snake.\n\nFor assistance with wildlife-related matters, please call NParks Animal Response Centre Helpline: 1800-476-1600 (to see if we can include the images shown in the handbook)",
    WildlifeMonkey: "Do keep food out of sight.\n\nDo not carry plastic bags.\n\nDo not feed the monkeys. One can be fined up to $5,000.\n\nDo not use flash photography.\n\nDo not approach the monkeys.\n\nFor assistance with wildlife-related matters, please call NParks Animal Response Centre Helpline: 1800-476-1600",
    WildlifeOtter: "Do not touch or chase after the otters. Observe them from afar.\n\nDo not talk loudly and refrain from using flash photography.\n\nDo not attempt to feed the otters.\n\nDo not litter or leave sharp objects in the waters.\n\nDo keep your dog on a tight leash.\n\nFor assistance with wildlife-related matters, please call NParks Animal Response Centre Helpline: 1800-476-1600",
    WildlifePhotography: "Do observe the wildlife from afar.\n\nDo not talk loudly and avoid using flash photography.\n\nDo not trample on the plants in order to capture a good image.\n\nDo not use food as bait.\n\nFor assistance with wildlife-related matters, please call NParks Animal Response Centre Helpline: 1800-476-1600",
    WildlifeBird: "If the bird is a hatchling or nestling, leave it where it was. The parents may return to it.\n\nIf the bird is a fledgling, find a safe spot for the bird to be. A fledgling is learning to be independent.\n\nIf possible, always don gloves and a facemask when handling wildlife.\n\nFor assistance with wildlife-related matters, please call NParks Animal Response Centre Helpline: 1800-476-1600",
    WildlifeInjury: "Kindly do not touch or move the injured or unwell animal from the spot. If you have spotted such incident, do approach our visitor services counter at the Entrance Pavilion or security for assistance. ",
    PhotoshootPermits: "A permit is needed to conduct a photoshoot within the Gardens. For any matters regarding photoshoots in the Gardens, please send in your enquiry to our online portal at https://www.nparks.gov.sg/juronglakegardens/connect-with-us/contact-us ",
    AVInfo: "The AV is used to shuttle visitors between attractions within the Gardens. ",
    AVSafety: "AVs are operated by trained and authorised personnel.\n\nAn operator will be on board the AV at all times. Should there be a need to take immediate control of the AV, the operator will do so.\n\nThe AV will move at 6km/h on average, similar to brisk walking speed.\n\nThe AV will emit a sound that is similar to tram bells to alert pedestrians if they veer into the path of the AV. The AV is also designed to stop if it detects obstacles or pedestrians in its path. ",
    AVOperation: "As part of the people mover system trail, there is only one AV deployed. For a start, as a safety consideration, it will run on weekdays where the Garden is less crowded and there is also less demand for shuttle services.",
    AVCleaning: "There is daily cleaning and disinfecting of the vehicles after rides. ",
    AVEmergency: "Should there be a need for immediate assistance rendered on-site, please approach any security guard(s) on duty. Call Agent can also alert JLG Fire Command Centre (24h): 6937 6687 if needed. ",
    BuggyInfo: "The buggies at Jurong Lake Gardens are mainly used by staff for operational duties including horticulture, housekeeping and security works. They are not available for use or rental by visitors.\n\nWheelchairs are available for loan from the Information Counter (open daily 8.30am to 6.30pm) at the Entrance Pavilion, for elderly or visitors who experience mobility challenges. These can be loaned free-of-charge, on a first-come-first-served basis.\n\nAlternatively, you may consider using our Autonomous Vehicle which is operating on Monday to Thursday, 10am to 12pm and 1pm to 4pm if you need help in moving around the gardens.\n\nFor more information on the AV, you may refer to our website: https://www.nparks.gov.sg/juronglakegardens/who-we-are/jurong-lake-gardens "
  };

  function speakDesiredIntent(desiredIntent) {
    console.log(desiredIntent);
    if (desiredIntent !== "") {
      setIsSpeaking((isSpeaking) => true);

      speak({
        text: descriptions[desiredIntent],
        voices: voices[0],
        rate: 0.9,
        pitch: 1.0,
      });
      speechSynthesis.cancel();
    }

    setIsSpeaking((isSpeaking) => false);
  }

  async function sttFromMic() {
    setUserIsSpeaking((userIsSpeaking) => true);
    setStatusText((statusText) => "I am listening");
    recognizer.recognizeOnceAsync((result) => {
      console.log(result);
      if (result.reason !== ResultReason.RecognizedSpeech) {
        setUserIsSpeaking((userIsSpeaking) => false);

        setStatusText(
          (statusText) =>
            "The chatbot is unable to recognise what you have said."
        );
      }
    });

    recognizer.recognizing = (s, e) => {
      setStatusText((statusText) => "The chatbot is listening");
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    recognizer.recognized = (s, e) => {
      let topIntentFromSpeech;
      setUserIsSpeaking((userIsSpeaking) => false);

      setStatusText((statusText) => "The chatbot is thinking..");

      if (e.result.reason === ResultReason.RecognizedSpeech) {
        axios
          .post(
            "https://southeastasia.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/4a96bb39-9f6e-47dc-9b27-bab93d286617/slots/staging/predict",
            null,
            {
              params: {
                "subscription-key": "5b77dd952e04456cb7ca8fe65bf409b1",
                query: e.result.text,
              },
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((response) => {
            topIntentFromSpeech = response.data.prediction.topIntent;
            console.log(response.data);
            setStatusText("The chatbot has finished thinking");
            setDesiredIntent((desiredIntent) => topIntentFromSpeech);
            speakDesiredIntent(topIntentFromSpeech);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (e.result.reason === ResultReason.NoMatch) {
        setStatusText(
          (statusText) => "I could not pick up what you just said"
        );
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);
      setStatusText((statusText) => "Chatbot has been cancelled");
      setUserIsSpeaking((userIsSpeaking) => false);

      recognizer.stopContinuousRecognitionAsync();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log("\n    Session stopped event.");
      setStatusText((statusText) => "Chatbot has been stopped");
      setUserIsSpeaking((userIsSpeaking) => false);

      recognizer.stopContinuousRecognitionAsync();
    };
  }

  const closeBrowser = () => {
    window.open('', '_self', '');
    window.close();
    // 1. Go to address bar and type about:config
    // 2. Go to parameter dom.allow_scripts_to_close_windows
    // 3. Set its value as true
  };

  return (
    <div className="h-screen w-screen bg-green-50">
      <button className="closebrowserbtn" onClick={closeBrowser}>EXIT</button>
      <div className="block py-5">
        <h1 className="text-center  text-9xl font-black ">
          Jurong Lake Gardens
        </h1>
      </div>
      <div className="block py-5">
        <p className="text-center  text-6xl font-semibold ">{statusText}</p>
      </div>

      <div className="block py-5">
        <p className="text-center  text-6xl font-semibold ">
          {desiredIntent && descriptions[desiredIntent]}
        </p>
      </div>

      <div className="block py-5">
        {desiredIntent && (
          <img
            src={require(`./images/${desiredIntent}.jpg`).default}
            alt="Icon for result"
            className="w-auto h-auto mx-auto"
          ></img>
        )}
      </div>
      <div className="flex items-center justify-center py-5 ">
        <button
          className={
            userIsSpeaking || isSpeaking
              ? "rounded-lg  p-8 m-8 bg-gray-300 text-black w-5/12"
              : "rounded-lg  p-8 m-8 bg-blue-300 text-black w-7/12"
          }
          type="button"
          onClick={() => sttFromMic()}
          disabled={userIsSpeaking || isSpeaking}
        >
          <p className="text-9xl text-black font-semibold">Start chatting</p>
        </button>
      </div>
    </div>
  );
}

export default App;
