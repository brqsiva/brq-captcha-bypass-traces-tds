import React, { useState, useEffect } from 'react';

const MultipleCaptcha = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [results, setResults] = useState({
    totalTime: 0,
    successful: 0,
    failed: 0,
    averageTime: 0,
    requestsPerSecond: 0
  });
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  // Get actual GUID filenames from server
  useEffect(() => {
    const loadImageFiles = async () => {
      try {
        addLog('Loading GUID filenames from server...');

        // Since we can't list files directly from browser, we need to:
        // 1. Get the first few files to see the pattern
        // 2. Or create an API endpoint to list files

        // Option A: Try to get a file listing (if server allows directory listing)
        try {
          const response = await fetch('/captchas/');
          if (response.ok) {
            const text = await response.text();

            // Parse HTML directory listing
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));

            // Extract PNG filenames (GUIDs)
            const pngFiles = links
              .map(link => link.getAttribute('href'))
              .filter(href => href && href.endsWith('.png'))
              .map(filename => filename.replace(/^\//, '')); // Remove leading slash if present

            if (pngFiles.length > 0) {
              addLog(`Found ${pngFiles.length} PNG files via directory listing`);

              // Show sample of GUIDs found
              addLog('Sample GUID filenames:');
              pngFiles.slice(0, 3).forEach(file => addLog(`  ${file}`));

              // Take first 50 files
              const filesToUse = pngFiles.slice(0, 200);
              setImageFiles(filesToUse);
              addLog(`Using first ${filesToUse.length} files for benchmark`);
              return;
            }
          }
        } catch (error) {
          addLog('Directory listing not available or failed');
        }

        // Option B: Create a list of GUIDs manually (if you know them)
        // Paste your actual GUID filenames here:
        const knownGUIDs = [
          // Example GUIDs - REPLACE THESE WITH YOUR ACTUAL FILENAMES!
          "0ffc8fed-6836-462b-b107-d6c949fbe38a.png",
          "01d90f23-c4e5-4999-901f-32dca890361e.png",
          "1bd39680-42cd-4e11-be15-e0aefdeb01e9.png",
          "1c3f7232-dcbe-4076-8d8e-9d6f6d7ea4c3.png",
          "1ca87c40-0eb5-4e61-98be-c46fd8874df0.png",
          "1cef186f-f2b5-460d-861d-863c9b4b9597.png",
          "1e30ca6a-0a43-44f3-8f1f-1d98a0752f46.png",
          "1e253fd8-7410-4a10-ab3e-a4059e112f44.png",
          "1e5720bd-c812-4ae8-af08-8e8646d374ed.png",
          "1efcf658-b415-464b-bc90-80d2dab0c782.png",
          "1f9a5e67-4961-40c9-b85d-c0efc733bfc2.png",
          "1f4989dc-a490-4a76-bddb-4814cecfac02.png",
          "02a2d9b2-c419-43e6-8736-0254dcc4516b.png",
          "2a585986-7c78-44aa-bbb7-7bbd9adce206.png",
          "2abbb747-ac69-49a1-a20d-ab0125a0f96c.png",
          "2b010e3a-6d41-4afa-91d5-a8c057018bd4.png",
          "2c57fc55-77d6-4210-85e5-9885b65765a7.png",
          "2cfedf53-f0c6-49e9-80fa-4a5d0c907646.png",
          "2d4f82fd-fbaa-497c-a0fb-73793137df16.png",
          "2d56de50-9bc1-4a22-880a-53acfad6c97d.png",
          "2d89dc7d-51d2-43ce-b461-8d22736bc4b9.png",
          "2e0b200b-3fc6-434d-95f9-25d88f88355b.png",
          "2e4aa438-b737-4232-8e85-dd0de405eef7.png",
          "2e89e9b0-157d-4724-9601-689a67864ec1.png",
          "2e1633f5-18c0-4917-b837-bfa0d6ba2410.png",
          "2fa4e96e-acab-46de-8b79-670ca26f9658.png",
          "03c331d2-a760-463c-ad49-7c4667ae4ec3.png",
          "3a84b290-1b26-43cd-adf4-643baab6e34c.png",
          "3acadde8-33dc-46c0-81b1-94799c4c17fc.png",
          "3aeadea4-4fdd-4a54-9657-41a4f9c9ca71.png",
          "3b0430b1-49a1-45d3-a591-c4343e586a12.png",
          "3c06b74d-8cf1-4868-b6a3-149961a08fb8.png",
          "3c914fb2-be51-4956-b2c4-3dc0c1c0fa88.png",
          "3c1217dc-0bf9-42ae-bb7a-ca3f87446616.png",
          "3c144477-e45b-4ca7-bc0f-edc67eda6255.png",
          "3ca1c1c1-5652-4e08-a764-70ab1e11473e.png",
          "3ce8ab93-7ba8-4531-bc02-0e097dded83b.png",
          "3d0ed949-a0ab-4a34-b58e-fca151920a49.png",
          "3d1f32e7-a604-4a65-b952-e0e8eb8e1667.png",
          "3d3acad1-a145-4e4e-aeaa-ea2d5747ffb4.png",
          "3df4c642-8f52-42c0-bdc1-69225769dc4d.png",
          "3e31cd58-a61a-47c4-a8e4-6a3ca02fa276.png",
          "3e913b05-eaa2-40f1-afbe-3cdc551f5c73.png",
          "3e1967b1-a127-453a-a364-28ecf021e432.png",
          "3fb4a0c6-b1f5-4d66-a097-3377a4d3efa5.png",
          "3fccf932-23d4-4c69-8a2c-3feb084bc206.png",
          "3fec1e40-2db8-46ab-b77f-1aacb6d147d3.png",
          "4bb89f6d-c26f-4a0f-a480-93f618409607.png",
          "4c2e5144-50b4-4601-ac38-3269ffc76644.png",
          "4c8a66bd-b69f-4acd-bf36-63d8bb1d9df2.png",
          "4c9d02c5-9437-439e-90e1-08672ea39819.png",
          "4c9553ce-0da5-4a4c-9291-7b0730e6a2a6.png",
          "4db536bc-fdda-424a-8ff0-ae363c9c2b7d.png",
          "4e4e77d0-516c-4214-bc8b-eb82b321271d.png",
          "4e80784e-cb23-4701-8bea-5cfd6319ccd9.png",
          "4f7b4210-bfe4-4b38-957b-5f9f4e6759a7.png",
          "4f143af2-b475-46f0-b512-53b71291399e.png",
          "4fb3bd4d-f64d-4c6c-b61a-80c9290fc6f1.png",
          "5bb9852b-ac6f-42aa-8fab-882b7691112c.png",
          "5c8f1ad7-b377-4d68-958a-c67c91906140.png",
          "5d2e6a02-e74e-41be-8bc4-cc82b29ab4d3.png",
          "5d6ebe2d-39b4-4bda-a45f-03910b3cb902.png",
          "5d63edf8-39ad-498f-b10e-f907be708be9.png",
          "5d996404-461c-4e06-9286-19d22aef04ff.png",
          "5dbab358-d2f3-44bc-8065-962b4e95f508.png",
          "5e759e39-aeae-45ae-8734-aff257aeeb7d.png",
          "5ed12115-3ba1-4b87-bd3a-e48486cee952.png",
          "5f6efe49-f233-41ea-8c23-57274496900f.png",
          "5fb5ee00-1c9c-407f-8232-bcde97e0b210.png",
          "5fd3564d-f7c8-4a72-9872-339602b930ec.png",
          "5ff2c7d3-0771-46da-bf33-418fbf81e003.png",
          "06a3cd7e-340f-4a6c-acaf-e588b538c608.png",
          "6a293b43-9c7a-40a2-a76c-0b039cdb8cb8.png",
          "6ad962e4-f18c-4162-af9a-d049c4ccf71a.png",
          "6b5caab3-16ff-48c8-a782-76e443419032.png",
          "6b68f2f1-4edd-467c-aa64-66496c37601e.png",
          "6b69fa3f-24ad-414c-8f40-98f1ec5b8e5d.png",
          "6cff3a2f-560e-4e86-b118-867399cd7949.png",
          "6ef6020f-362d-41c2-93e9-1c7b9878864e.png",
          "07a2b03c-2ec8-4075-866b-2a86010178cc.png",
          "07a282f2-640a-4174-af41-28ccb69dce41.png",
          "07f3daba-95d0-45f3-b917-c392a46359b1.png",
          "7a13ef7a-376a-4d1d-87ea-6b1739135d35.png",
          "7af2c093-d2f4-470a-86e0-745681635d70.png",
          "7bc75078-8d39-4679-8c89-49a42bf52748.png",
          "7cbce157-9405-43aa-a5f3-4d3b8ab30096.png",
          "7dee72c4-4bda-41bf-aec0-4b98e9cf32dc.png",
          "7f3f1328-6545-4edd-94fb-795b1b988081.png",
          "08c68c97-408e-4ed1-8c51-2b847128525d.png",
          "08c29506-0390-4d3b-adb2-857329f0043d.png",
          "8a8b4137-5edb-4ab6-bc26-0438f5e90ac5.png",
          "8aa3a6ef-f578-463a-a311-efd171722f33.png",
          "8af33349-996c-4690-8411-248baddac775.png",
          "8b105ba8-7b98-4267-a1f3-1f72240c4447.png",
          "8c678e01-ccd4-4046-a0eb-633e931ac907.png",
          "8c80771d-23f2-4550-8736-4aee3e374a19.png",
          "8c96550f-77c3-41ce-8f8f-1541eff8632d.png",
          "8ca136f6-29ec-446c-80ad-113ca3034728.png",
          "8cc89efd-ddb2-4980-8c10-032cfb41d284.png",
          "8ccec577-3e0f-425c-88e3-c3a96856f0cc.png",
          "8d255e72-4f20-4cc2-8c86-1d13723b2ed2.png",
          "8ea9c8e7-f505-4afe-856b-8d9bcf07fa5d.png",
          "8ee1d498-ec65-4282-b6c0-000a9dd84118.png",
          "09b92350-4684-41ca-806a-88b39cd87b1d.png",
          "9a6a997a-5bd9-451e-8fcc-f9b8efd0f996.png",
          "9a35396e-cabc-4606-a3cb-3b6d56e775c0.png",
          "9acdab55-d756-4e60-8087-34bd164ffb5f.png",
          "9b975fb0-952b-4c93-9264-480b703c0eca.png",
          "9b473187-a437-476e-a921-24e229dff4df.png",
          "9bc134f2-c848-4d78-afd2-d8abdc5e0279.png",
          "9cc381a0-582a-4ae7-8f5e-eb8b6e88623b.png",
          "9cd4ae97-a1d4-4ff3-98c0-e9ee0db58412.png",
          "9d3cbedd-42f1-48ff-b85c-88beea428cb0.png",
          "9d787183-7502-4e93-bd7b-b8c0c1404e65.png",
          "9e5db3ab-5809-4f77-8ac5-1e2b03754592.png",
          "9e9eb463-ffa0-42cf-9340-0fd95cebff39.png",
          "9e33ade2-3f32-4778-bd97-6f517b329fcb.png",
          "9e7521ec-3231-4e56-9073-e0b7edfdba57.png",
          "9eadd9b2-efb4-491c-a657-0851b895f3ba.png",
          "9ec333af-037e-4691-9a5c-91ffeba1f1e1.png",
          "9f902a49-0ad5-4fd2-935f-3f484f4349c6.png",
          "11d4bc4a-c370-43d6-9d48-74ba12858162.png",
          "12a83c89-3ce6-4db4-a8ce-101017ce7829.png",
          "15ae15f5-80f2-40bd-901f-680fff2f5085.png",
          "17a60a48-b514-494d-bbac-c0c13e1d0729.png",
          "17f8f496-b483-4610-b5d6-cd1756a26ce5.png",
          "19b13a9d-433f-48c3-8700-9a77190b5153.png",
          "020fb0ab-42db-462a-acdf-20ce2a0d1a5a.png",
          "22a46515-5edf-484c-8ff9-3c6acf188e1c.png",
          "22e222d2-146d-4c5e-91bf-7fd845d1c3c1.png",
          "23e35ad3-d017-4ea2-bb7e-dfaa066884ce.png",
          "25b8418e-ef52-4478-9769-a0d597d7782e.png",
          "26b5a4d1-2680-40f0-b16f-b34a1912e970.png",
          "29a7551a-20cf-4eb6-8909-758816d9e860.png",
          "30dc092c-730a-49e2-81a4-bf7230ce47f2.png",
          "31d70353-2736-4ef9-ac92-368f8f6dbe9e.png",
          "32b7dc51-93d8-42b8-a5d2-d8875ad04249.png",
          "32e9394a-d353-4d9f-b6dd-171d1adba3e7.png",
          "034c2874-b152-46ad-b8dc-f9947a7827ef.png",
          "38b45f72-7636-456a-bd78-0a5bc0da0884.png",
          "43a1fa1c-1bb4-4e5d-b202-fa389e3b3960.png",
          "43aa3879-2005-4440-a1d5-162d2ff8a76c.png",
          "44b77404-ae34-4cc0-8584-37ec31a84142.png",
          "45f4a787-abb3-41b7-a3cc-87885b29290d.png",
          "46a7ceec-2604-4dbe-8260-96b6b6623d5d.png",
          "47ebf516-a1e4-4364-9e99-ceaf4dc7afb4.png",
          "51adc8d9-c76f-4e27-bd37-04d7f89a30e2.png",
          "52c7cdf6-e167-4a6c-9bc1-0f445df799c2.png",
          "56ad2c0a-27b2-4226-b8ad-da2f895d37df.png",
          "56e0a9c9-004e-4080-8fe6-8f12c99d7779.png",
          "56f1f847-021e-4968-a43f-b2bcb96c2d3c.png",
          "58d48bcd-2e52-443f-89ed-57efc5634200.png",
          "59c3702d-cb9e-4aa5-9382-9da9db5677d4.png",
          "60bb35fa-b80f-491e-a29b-fe8715b1b9ef.png",
          "60e52678-a6ca-4bba-ba77-9be2312a9698.png",
          "62d5597d-cd38-4327-9f4d-c3f2974eb976.png",
          "63ca7ec9-a304-45c8-8a39-ab1c82d1e82f.png",
          "63cea02b-ed22-4ed6-83f1-008a3cbadccb.png",
          "65b189dd-3ed3-46cf-9e08-f057b478793e.png",
          "68c4e3ce-804c-4f2e-8b26-05d8781e99bc.png",
          "68f25363-5ae8-4b65-95ed-d5e48c49d671.png",
          "69e86273-6aa7-46be-8146-6bc74889220c.png",
          "69ffcdba-8ceb-44ea-a0d1-48983ece9373.png",
          "70c36778-45d6-4fac-a836-5612ae5d187a.png",
          "72b0cb92-24aa-4d7b-a2e0-7e577a3da337.png",
          "74af1aab-c3c7-4bf9-976b-ab005e27bd76.png",
          "74f092ab-36df-44af-9e94-60c0a6de815e.png",
          "76c562e5-3a79-40c1-8ea6-5578d124fe92.png",
          "77c8b9a8-2174-4e41-89dc-2705b591e395.png",
          "77d9e5cd-7b39-4445-a04c-c06b351e07eb.png",
          "82b48d1a-d001-4b5b-872c-2e0622905749.png",
          "82b09491-831d-4ea5-9884-5d7bf570be56.png",
          "84dbaad9-5983-45ea-b1e2-3d433a2c386a.png",
          "86b0e5bd-cff3-40ab-9854-e4cd71ed77bb.png",
          "87c3a99c-77c3-49dc-91ec-7436ceb3adac.png",
          "87e00d13-10e9-4950-b2ce-cd57886e0180.png",
          "88bedb6e-c566-4a42-a9a3-505370a5b144.png",
          "89c47fee-56aa-47c7-b4c4-19c6bfe680cd.png",
          "89cd5c48-a68c-473f-ba5e-8bbbdf774c7b.png",
          "89e6d19c-3cac-46d2-9ebf-8afda84741e0.png",
          "92d36de6-7f30-426c-a3b2-1d50421afb03.png",
          "94b01c63-7fa7-474c-bf50-86975af77074.png",
          "96b421c3-2df3-4fdb-b932-3a9f12fbf3c4.png",
          "96c552c8-25b4-48d1-9b9b-bc564e9171bf.png",
          "99d03bc6-2174-4b9c-b553-7ff24bba456e.png",
          "143e7a57-a665-4fec-9df1-e58000fcb2c6.png",
          "149e34ef-1488-4d3a-a76b-060defbd4e2e.png",
          "171e8010-8c4f-4479-95b1-4081bae78ccd.png",
          "181df28e-5eac-4ec5-bb85-6b07866048ae.png",
          "222fd21a-ae69-432e-8b07-37e8d0e6d05a.png",
          "224ed970-b43d-4395-b149-2355febe0164.png",
          "231cc37c-45fc-4f57-af13-4d1a879a18ab.png",
          "310cf92f-5355-4967-82b3-e12473b253d2.png",
          "376d92c7-9abb-4ae7-b410-aa5b0e7514fa.png",
          "392ceff0-2353-4aa6-aff0-554f125d2769.png",
          "0399aa0a-8e8a-4a65-a0ba-ddeeb808c4ff.png",
          "420e98fa-91a6-4760-b759-9fa79b195edd.png",
          "445a19eb-d8e1-4f36-9411-d477183829dc.png",
          "00446e96-37fd-4e29-b2b9-fff28030eaa6.png",
          "468c2c1e-1c37-49ce-95b3-5f33ac2e9c69.png",
          "468f67b5-6e87-40be-93a3-ed6860d5b9b2.png",
          "471bdc16-64d4-4bd4-bf2b-b1ad098033f9.png",
          "502fdb50-d20c-47e5-809d-bcc680acd97b.png",
          "507e3213-04ac-4075-8ba7-655d68c44a78.png",
          "513f66db-331d-47fe-ad2a-16a52dab0c11.png",
          "596d1b3f-13ce-4844-94de-4cfe06c3135b.png",
          "609d6a5a-593c-47a4-a265-2620524c26da.png",
          "636e23f4-de2f-41d4-b75b-d5a0bacda5c4.png",
          "638b80e6-677d-4040-a0a9-81c42cc999db.png",
          "640da8e7-748c-4cdc-934c-2b44f619750b.png",
          "667ac3ed-4f53-4bcc-8638-6abe768eea01.png",
          "684e1a66-d5fa-46b7-8137-b3e911170545.png",
          "694f3ea7-fbc7-4197-9a7d-d88945513b7d.png",
          "723c2ad2-1437-47c1-a8a1-e42292edcd3c.png",
          "0732bcbe-cf9b-4d02-b19d-bdf2bafec504.png",
          "758cb43f-7dc2-4841-b34a-f35e774606aa.png",
          "759f1e3e-0284-40c7-9820-9a58fabe90b9.png",
          "0875b32f-3787-428d-b200-a710e01229cc.png",
          "896aa2e6-8832-49bd-b5db-8fc48ed156a4.png",
          "899c471d-6a09-4725-914f-5f7c7d01d564.png",
          "902f8e70-4f91-4487-acf0-8735918e4ca7.png",
          "954e1d85-d771-43b6-b0b0-94b5b12afbc7.png",
          "979d9641-22d7-46ce-8993-ad6ff2279ab9.png",
          "2219b200-0bef-4fd1-a80f-5b33842acd78.png",
          "3095c347-d23e-4916-9a1e-c748d44eb2db.png",
          "3106dcc8-76cf-461d-9e77-7610ef50b1b4.png",
          "3471d877-37f2-4bc1-a798-cd6d82a1147e.png",
          "3580c979-c067-400a-8e4d-39ce4003797e.png",
          "3974d241-b6d7-4044-88b3-9b78683a8e09.png",
          "4175a713-f02f-4a51-ba00-46773ee070a7.png",
          "4298a973-ad98-44a5-a129-a905b73a0ea5.png",
          "05262ffb-f5a9-4bc0-88fb-91baaaa94b6d.png",
          "05738c71-4d8e-472e-87dc-852743459ab8.png",
          "6366d060-d443-4a9d-9c46-55e0f9c2c028.png",
          "7463f423-9e83-4143-966a-39c449cbffde.png",
          "7496e3df-4011-46ec-b1da-8e15b44c979a.png",
          "7505f8c9-f51d-4c13-a9ed-d4d94e44ed8a.png",
          "7598e4ec-3f54-4010-be61-8a6b33076ca4.png",
          "7835f92c-03c2-4ea6-be76-316e28557121.png",
          "7943d87e-2352-4994-875d-5fd5db8d70e3.png",
          "8234ecb2-c9da-44d4-b2d6-efa415528564.png",
          "8313b742-91ec-4900-a22b-6b608f01afec.png",
          "8688f82c-125e-4aca-97c9-eede2f871120.png",
          "08724b0d-85b9-4960-8440-ad70ae770ce9.png",
          "8987a9ef-828e-4f72-9b5d-c24afe5a4bfc.png",
          "9275b93c-c9ea-4b2d-a587-7cfe102c5160.png",
          "9468a17d-7f18-446d-abf8-8a50c605b61b.png",
          "9469aa44-dcbb-492d-b3c3-c9493475e102.png",
          "9498eec5-2afd-441d-acd1-a74022aa1eb5.png",
          "9673b57f-e86f-45e0-8a60-29a223617a08.png",
          "9959c76a-42e6-4b9b-aa18-85b9dfa272ed.png",
          "13805b14-02ae-4aaa-a8c9-6ddd386bf2a3.png",
          "015069db-184e-4c13-9669-315c02a9140e.png",
          "37617d19-299d-4bf5-a5f5-9c4185a9355a.png",
          "038688bc-9c99-4db0-904f-c85dfd6ce54e.png",
          "40269b3e-f908-4bdb-aad9-bda06fc68470.png",
          "41395fd5-0f21-4ac8-aa93-ab9ea396bd34.png",
          "46421a2d-7c0e-4baf-8b3d-619fc92bff8f.png",
          "47514b4c-3218-46a2-a1f5-a44f1b46bada.png",
          "54585b8a-716d-434e-82cc-54ab891efa33.png",
          "55152d80-2150-496e-ba4c-07945d6ab97b.png",
          "60728ef2-8342-4e81-a4fc-d8b92d3495d2.png",
          "64711c53-6623-4dd1-a226-8a8990068f0c.png",
          "65581bfe-a65b-446c-ae89-ec7aac3f968e.png",
          "67035a36-108e-4113-8a2c-dd6b4d894ec3.png",
          "70827a91-0915-45e8-ad3b-6e0129d80d0b.png",
          "71092f55-8966-4628-a7ae-e3fe6172809f.png",
          "73852cb8-09eb-4b69-a8ea-9c34438e9786.png",
          "97940a0e-7a4b-47d2-aedb-f3d67ca31c39.png",
          "98103d4e-b4f5-444b-9df8-e0e2a76632ed.png",
          "99751a31-f2c1-4529-aedd-80d71186d15d.png",
          "320567f6-15b8-482e-a3ea-dee6db55407d.png",
          "440518e2-2f8a-4b14-9be0-440ef30ed0e8.png",
          "499297d8-fb65-43b3-8bf2-98cb3dfba358.png",
          "516217ae-4b08-4fd1-8ef5-096b99a42b58.png",
          "565222ed-d3b2-43ff-8f93-9ec3f3c34bf7.png",
          "571449db-f034-4e52-8f21-d9c230faf123.png",
          "00692641-2399-4105-8c23-fdd326c49f44.png",
          "793262de-82e3-4bad-9c0f-673be8e3d6a0.png",
          "870468a0-e4d3-4e49-ad18-38790e3e3bdb.png",
          "974036bb-3175-4026-9e97-9a6731c8ba99.png",
          "1127590f-ee54-449c-976d-75fe76b26e3d.png",
          "2675035b-2944-4c77-b9dc-d4c5f25d73f5.png",
          "3008817c-a45c-4eab-815e-5d5fbc205a8d.png",
          "4283673b-7054-4257-955b-01916800191e.png",
          "4546448c-7bff-43f2-a519-ec2ebf51eb0e.png",
          "5058861f-a638-4903-807d-bb902ac70ef9.png",
          "05756146-6138-40ee-b178-b38ed89004a7.png",
          "6709167a-3362-4038-beb2-8896860b49bf.png",
          "07195574-b0f7-4540-965f-4b3a6945a151.png",
          "13834145-ff02-4b32-9425-a720f9b1de0e.png",
          "21132589-4887-44d7-b234-660c9b10f7bb.png",
          "24184949-9e74-40db-863b-73dc579afb59.png",
          "46695345-8eeb-483b-9846-f754c1ef0bbd.png",
          "52343595-53cc-4481-b881-164a08b75913.png",
          "55392261-0a01-4ad8-b059-e6f98ac0bac0.png",
          "60440298-3b64-4532-9540-de9792ea8642.png",
          "65524884-3837-4335-8e1d-2df040847b8e.png",
          "72648453-9ab9-40ab-b621-1e96931b7619.png",
          "86268537-85a9-4b2b-985b-38f77d3c2e10.png",
          "88629926-3722-4487-a2d1-7b58c72e89e2.png",
          "93798630-c9af-487b-bd10-855bab685dc8.png",
          "a1a4a7a4-1c88-4c03-a80a-6f68e41e472b.png",
          "a1d1f5ae-b175-4977-96a1-285c72fb1771.png",
          "a04bbe65-fe2e-41e4-971c-ff70008849c0.png",
          "a7e2d332-17ae-4cd0-9075-fb1f6cbeedad.png",
          "a8eb289f-7d2f-4dbd-8a3a-6db56c2380c7.png",
          "a09d8be4-1b84-408b-8db4-9803e35eab5b.png",
          "a22ffbca-15e8-4d92-8d02-7ffe125b84ca.png",
          "a37c657a-0b13-4f48-9b86-f9864cbf6fba.png",
          "a044dad8-7725-4bee-b032-579218ea667b.png",
          "a049164d-3ee8-481e-80c1-9446846bbfb4.png",
          "a747244e-4918-419a-a748-207f4bbeaec4.png",
          "a1517693-be58-437e-bae2-8bf89baa4a45.png",
          "aa00bbdc-b2ae-4084-81d0-7f816d4aa778.png",
          "aa860433-9271-4224-a66f-2598d2749239.png",
          "ab5a2d29-babd-40b8-918c-2948a7e497a1.png",
          "ab6d4af1-d6ae-45e6-8514-17846b5c71a8.png",
          "acbca87f-49c1-4f3f-9603-1a989f95855c.png",
          "ae586c2a-d014-4af6-a8db-285535578270.png",
          "aec0c626-6965-4c30-a290-fbe36e1a4c2a.png",
          "aefc430b-70ba-49b6-8d2d-c4aa21d69a4a.png",
          "afd51684-84ca-4738-8475-679380f3a394.png",
          "b0ac77db-1da0-472e-baad-3645fd9c5fcd.png",
          "b0e19aad-e776-4192-9634-339ba4040f7a.png",
          "b0e77cb2-9e64-4cd0-b6a2-d1d65a621d1e.png",
          "b2dd3124-809b-4aaf-91f9-7800df0150f3.png",
          "b4f6f32d-3645-4711-9bc9-bf2bee0f7627.png",
          "b5c7289d-f820-4829-a588-e902968a162a.png",
          "b5d63333-0101-42e7-989d-62492423f569.png",
          "b7b3c06c-e183-4f15-87c4-69621946e4f1.png",
          "b7e042f3-9eb0-405d-8481-28d506c2a71a.png",
          "b7ff47d6-45f9-44ca-89d7-368ecc2483ba.png",
          "b15b7a76-2490-4ed4-b1e8-f2fba08aaaeb.png",
          "b25af786-55d6-40c8-9d04-6f1d6790ce3c.png",
          "b34ba05a-bcae-45ab-948c-9fb274c9b5b7.png",
          "b49ecc0c-b226-47c9-b3d3-546ec84520b2.png",
          "b82cddd0-736f-43ee-9fff-d13559f84464.png",
          "b0232c03-48ec-4b2e-a244-b3c6f966616f.png",
          "b769cec7-c1c5-4a6b-8464-92862cc1cbdd.png",
          "b68092f5-c085-4957-b22a-efb3fe28cd36.png",
          "b79358fb-22f9-452c-840b-617aa4451dbe.png",
          "b189504f-0b47-49e6-ba69-d671daf85533.png",
          "b6402624-2927-4278-b87c-a714bfdb56be.png",
          "ba7d2e62-1923-460e-b640-3d27cbca0079.png",
          "ba9eef6c-7a43-4c5c-b9f4-95d79a933be6.png",
          "ba88f0eb-3bc0-4240-b03f-03d2f498f76d.png",
          "babdf3ce-e761-45ce-9e6c-dccd0d2137c1.png",
          "bb983611-e11e-4404-ad8a-63367e26d31c.png",
          "bbbf4cdb-02bc-40df-9f55-a2e1fe4173b4.png",
          "bdfa751d-d749-4c75-9726-f130ac2d8313.png",
          "bee377e5-03ec-4928-87ff-2ff30758ed71.png",
          "bf9d911c-d6be-4c7a-a52e-3ae1354bcd6b.png",
          "bf8115de-7db6-4156-9a4d-b67fcad4b39e.png",
          "c2d3ccae-7087-4bc9-919d-767666bb3409.png",
          "c2e0eb5c-4cfc-4430-b507-01ea642a73ec.png",
          "c04c3d63-eb8e-41ed-802d-edf9a65c008b.png",
          "c5d744c4-d146-4cf8-9013-a439b673045f.png",
          "c5ffef2a-1df8-484f-b9b8-a4577db8fb26.png",
          "c6e19694-688a-4158-bf1b-f8c1313c12e6.png",
          "c8e6e2be-c4fe-4d88-aa31-23884ee4953f.png",
          "c9bb7561-b44b-4757-9109-03c9f90318fa.png",
          "c33da1bf-b009-4a44-bc0b-aeb2864e6649.png",
          "c68d023b-73eb-49d1-bc4a-a1e71fa3c863.png",
          "c75f7d29-2e8a-44e6-9ec6-e2e86aebd446.png",
          "c79afb70-9dc0-41c0-ad10-56d9c4a11ac3.png",
          "c704a439-9187-45cd-8e02-334601fc5973.png",
          "c821e187-ba0e-4c18-846d-a35e5772ac90.png",
          "c831bc71-f8ce-4271-a694-c92f897a16a5.png",
          "c5953e4e-bd17-4d74-867b-395054c1e5e8.png",
          "c7214e22-1a21-40f0-bee1-e01576dff992.png",
          "c7611e31-d2ec-4748-99fe-0fbf775b9ead.png",
          "c8696bfa-eb08-4884-9cc3-a444f31bf0d2.png",
          "c0994126-e6d2-4d67-a23f-c35cd6c790ee.png",
          "c8860160-0f72-4ae2-8fdb-81ccd455eb7a.png",
          "ca56dee7-4e6f-4936-ada8-772f335acba7.png",
          "ca764e10-ccc1-4561-af90-b3ff1cc250de.png",
          "caedbd35-f11c-48a8-8d14-148f99ece916.png",
          "caf0ad43-f8f9-4c21-a6a4-f97859799504.png",
          "cb42c668-5988-4475-815c-efcf3cbfefba.png",
          "cbd5ad43-1570-433d-98b0-69cae8f5b13a.png",
          "cc8d2ab1-715a-417c-a8d4-8328bfd8bcd6.png",
          "cc66d5f5-f1b4-41b2-9466-7f9a0cc03cbe.png",
          "ccdf7b98-f88d-47db-b5a8-b58421dea5d2.png",
          "ce64122e-8856-4607-847e-74a8de6aebb6.png",
          "ceb9528f-407c-49dc-b34c-e2e9ed0540e3.png",
          "ceef78bc-8ace-4328-8207-18ee592dfe8b.png",
          "cf5c1c7c-6a12-41e7-828f-720ee73eb8d8.png",
          "cfd2fc50-00a7-4e1f-a9ff-7f9e8a32b0f3.png",
          "cfd32d87-190a-4c7a-a90d-b0ef9add76c4.png",
          "d0afb7fc-9e46-467b-b44d-75a3ff0d654c.png",
          "d0ca15ef-3510-436d-9824-26010abe5edb.png",
          "d3c752d2-31df-4392-b2d4-a9cd9f6321fd.png",
          "d4f9cf78-85c4-42be-b7f8-664994155f06.png",
          "d6b76372-7851-471d-91f7-f327c414915d.png",
          "d6ba544a-e182-4a58-86c4-f3a5414febe3.png",
          "d7b729d7-5275-47cb-b28c-121d333f86b1.png",
          "d8ab9d32-3a49-40fa-b381-849b438233f1.png",
          "d8b95a74-ecf6-4dec-a264-0d74612a9521.png",
          "d09b220a-b423-47f3-9b11-f407b4eb63c0.png",
          "d9c0a143-6c90-4e6b-8981-c07a9b9e76e5.png",
          "d9c1bf08-118d-4a6f-8b13-8978abd4b3af.png",
          "d13aeefb-421d-4c41-95a5-63f4b143200f.png",
          "d22da3e7-7b8b-46b6-9e4c-84305436f495.png",
          "d038f247-afbc-4c8e-a1ec-348a28d67094.png",
          "d043fc36-303b-428b-9b2e-7c76fb87f5a6.png",
          "d61a0c55-546e-4e76-a58a-5c5442c84ad3.png",
          "d090ce75-0f02-4b55-9237-5ef844a7e2e4.png",
          "d196c736-6203-471a-8733-554c3876092b.png",
          "d499c046-b134-461c-9149-1cc93f9e5745.png",
          "d713b4a0-0e48-4c1a-93d4-ebfd44344b96.png",
          "d831aff7-9675-49ad-894f-b92208a9c5b3.png",
          "d3358bdd-4663-4bf0-9a97-b0f2c5bc1e22.png",
          "d3798ac0-ee45-450d-b9e8-fdc869f78822.png",
          "d7594ad7-5895-4bc2-9449-26544a9d3f22.png",
          "da82b225-8a3e-46be-b7c9-91e51c73989c.png",
          "da067743-7d25-4923-9183-dd00b3deeae2.png",
          "daef08d4-fc73-4842-94d4-f071d1a2a2e6.png",
          "db8df30a-b429-4bb1-9f77-34c2d0c59267.png",
          "db64fb5e-2b0b-404e-abad-daa57f158536.png",
          "dbb44d37-c81b-49b2-a6ce-0adf6c8cd3ea.png",
          "dbdef8e6-ff71-4529-a4b9-49572bfa6e98.png",
          "dcb0874d-e59b-4388-ad5e-46d3ad2fbb5d.png",
          "dd919e08-c0e8-446b-9038-234c0ce89acc.png",
          "ddb1ac93-f09d-4651-abb5-cae6b58215d6.png",
          "de9d7b51-ccc1-4be7-a5bc-2fa7e95ca177.png",
          "deb7979e-b44a-4141-b3a6-a97d088a6868.png",
          "debb7854-bcea-408a-b589-40fbc16e4e78.png",
          "df3726cb-490b-48cb-bc1a-1ae44e4ee0e2.png",
          "e0db7605-6ebf-455c-bcf6-b1edcea8db11.png",
          "e1c18917-f192-4a75-872a-ca443bd19c23.png",
          "e2fd82d9-73cc-41c4-b46d-a0744006a524.png",
          "e3d0e4d6-e99a-483b-a16d-66cb3a31a1c2.png",
          "e6d5d6be-c52d-4dfd-86d5-093ab4231a45.png",
          "e6ec39a6-023c-4361-8240-79c67ab85123.png",
          "e8cbe629-dcb4-4bb3-860c-296765fdb324.png",
          "e012ab5a-b038-4f1b-b02c-58072376b99c.png",
          "e31ab816-74a3-4669-8bc4-eac241975d0f.png",
          "e53be8df-aec2-42bb-93ed-aed152b740e1.png",
          "e596d4d9-2035-4340-96c8-fa987dfd471c.png",
          "e6068c20-b2ee-4fc2-92ef-ac8c4a5e299c.png",
          "eb6ec92a-c015-46fc-8a36-7ba0c24f8711.png",
          "eb59a5b0-75ca-4df5-9a03-cd666529e544.png",
          "ebe9d9ef-dddd-49ce-abea-0d6137f1f97b.png",
          "ebf390f3-50b7-4b1d-8ecf-cdc2aadad56e.png",
          "ece431e3-2fed-47e5-9914-c3142e06f69c.png",
          "ed08d56f-14d3-42be-bac6-1c9742169831.png",
          "ee39efdc-4638-4ad9-b098-85996d7b6db2.png",
          "eee75a66-1940-4924-807d-eada6dcb6421.png",
          "ef358619-646c-448a-84e2-f7665e6b75a4.png",
          "f0da61fd-3de8-4c0d-93cb-a1cdbc10f530.png",
          "f7a6017f-dd91-438d-872c-159cbcfeb904.png",
          "f7e8e652-e57f-4876-9dfc-fa7b370a333c.png",
          "f8dc1024-7e1c-4d02-b25b-2363543fd525.png",
          "f9c9b901-a449-4d15-a0c2-76ff2abba88f.png",
          "f010cdc6-0b42-48e7-8e2e-79843b992121.png",
          "f26d66b1-e769-4fd7-b7c8-2ddb40372d1e.png",
          "f68bbcd1-71b5-4a98-af94-81d87d27336b.png",
          "f72deb95-f8a1-4bcf-a629-74be9bf22af0.png",
          "f633a569-0d37-4646-9887-9aa53b1fba20.png",
          "f887d161-6417-4be5-88c1-9e39776f56fe.png",
          "f3363b9d-9f7f-4aae-82ae-17ac23efc3d5.png",
          "f7550d9d-5010-4e0b-afbb-b5591c4eb037.png",
          "f178541f-371a-4d8a-b5fc-e91486a12e9f.png",
          "f759413b-7603-4505-9c4a-76dd1e45db4f.png",
          "f3313606-2217-4364-8f59-83ed44825306.png",
          "f7536642-374f-4faa-86e2-f72f6e7dbce1.png",
          "f9595784-df72-4f09-9b4b-75e67ffa8ace.png",
          "fa2bb660-24d2-49ba-9eae-c158d4f4b1de.png",
          "fa7ec4a8-1772-4a0e-8826-b7c7840c9f90.png",
          "fa47be17-3f6d-4db7-aabe-ad1c7146e8c8.png",
          "fac9ca2f-7432-42c0-9cc1-2385c833662a.png",
          "fae3caf5-21e8-4a3d-a62f-1c97c1a174e6.png",
          "fbb60d1c-0bd1-47dd-98ee-527cabb9182f.png",
          "fca479ac-cd92-49ca-adcf-e90650233d61.png",
          "fd1c2013-67f5-4c14-917d-01657b38e4a2.png",
          "fd8eedf4-991d-4995-a6e7-f6b2fe136c4d.png",
          "fd8f624c-73fc-470d-9b30-4f9d815ffb82.png",
          "fd73f406-2dcd-49fc-972b-7b5939a3d79c.png",
          "fd498cb8-1faf-4ae1-baad-76939a919b87.png",
          "fd651fa3-f43f-4293-96ee-eff8d32fec20.png",
          "fdabf31d-d0c8-4b63-9c4a-b9f8c11f47b5.png",
          "febce1f3-18f3-45a0-b30d-15cf34c0aac6.png",
          "ff8837a6-0d61-4edd-980f-aeb58c8fdf82.png",
          "ffef9298-8a2e-442a-9249-8665e0adc8cc.png",
          "00a42b95-208b-4625-ab22-85a72cf355b3.png",
          "00ce08d9-4107-47fd-9e50-ad840b86bec3.png",
          "00e64a58-7d7d-44b3-ab2b-21a19c76e7a0.png",
          "0a54f00e-f4cd-4640-938c-f458743574f1.png",
          "0acaef1c-c9fb-46bf-a67c-3d927358f19c.png",
          "0b7884f2-7c7b-4c3e-a49a-62a8ba359670.png",
          "0c9a6b30-4158-41c6-8a66-617ea1b0a679.png",
          "0c47f4d0-d8ce-49de-b25c-031b53415f46.png",
          "0c378b7a-9e1a-4653-9a65-106150233202.png",
          "0d92b85e-ee95-46cb-ac72-219ec0eeab37.png",
          "0e379fa5-4178-4f2c-a6ef-53192466b339.png",
          "0ed9a376-8c03-4b7b-8f7f-f5f42fc53d6d.png"
          // Add all 50 GUID filenames here
        ];

        if (knownGUIDs.length > 0) {
          setImageFiles(knownGUIDs.slice(0, 200));
          addLog(`Using ${knownGUIDs.length} manually specified GUID files`);
          return;
        }

        // Option C: Test with a single known file first
        addLog('Testing with a single known GUID file...');

        // First, let's find one actual GUID filename
        // Check your folder and paste one real filename here:
        const testGUID = "YOUR_ACTUAL_GUID_FILENAME.png"; // ← REPLACE THIS

        if (testGUID !== "YOUR_ACTUAL_GUID_FILENAME.png") {
          const testResponse = await fetch(`/captchas/${testGUID}`);
          if (testResponse.ok) {
            const blob = await testResponse.blob();
            addLog(`✓ Test successful: ${testGUID} (${blob.size} bytes, ${blob.type})`);
            setImageFiles([testGUID]);
          } else {
            addLog(`✗ Test failed for ${testGUID}: ${testResponse.status}`);
          }
        } else {
          addLog('=== ACTION REQUIRED ===');
          addLog('1. Open your captchas folder');
          addLog('2. Copy a few actual GUID filenames');
          addLog('3. Paste them in the knownGUIDs array above');
          addLog('Example: "3b9a7f2c-8e4d-4a7c-b6f2-9e1d5c3a8b7f.png"');
        }

      } catch (error) {
        addLog('Error loading image files: ' + error.message);
      }
    };

    loadImageFiles();
  }, []);

  // Rest of your component remains mostly the same, just using GUID filenames
  const processImageBatch = async (imageNames, concurrentLimit = 200) => {
    const results = [];
    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < imageNames.length; i += concurrentLimit) {
      const batch = imageNames.slice(i, i + concurrentLimit);

      const batchPromises = batch.map(async (guidFileName) => {
        try {
          const startTime = Date.now();

          // Fetch image using GUID filename
          const imageResponse = await fetch(`/captchas/${guidFileName}`);
          if (!imageResponse.ok) {
            throw new Error(`Failed to load image: ${imageResponse.status}`);
          }

          const blob = await imageResponse.blob();

          // Check if it's actually an image
          if (!blob.type.includes('image/')) {
            throw new Error(`Not an image: ${blob.type}`);
          }

          // Create FormData with GUID filename
          const formData = new FormData();
          formData.append('file', blob, guidFileName);

          // Call OCR API
          const apiResponse = await fetch('/brqaiagent/detect-text', {
            method: 'POST',
            body: formData,
          });

          if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`API error: ${apiResponse.status} - ${errorText}`);
          }

          const result = await apiResponse.json();
          const endTime = Date.now();
          const processingTime = endTime - startTime;

          successful++;
          addLog(`✓ ${guidFileName}: "${result.detected_text}" (${processingTime}ms)`);

          return {
            success: true,
            time: processingTime,
            text: result,
            fileName: guidFileName
          };
        } catch (error) {
          failed++;
          addLog(`✗ ${guidFileName}: ${error.message}`);
          return {
            success: false,
            error: error.message,
            fileName: guidFileName
          };
        } finally {
          processed++;
          setProgress((processed / imageNames.length) * 100);
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);

      addLog(`Batch ${Math.floor(i / concurrentLimit) + 1}/${Math.ceil(imageNames.length / concurrentLimit)} completed`);

      // Add delay between batches
      if (i + concurrentLimit < imageNames.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { results, successful, failed };
  };

  // Test a single GUID file
  const testSingleGUID = async () => {
    if (imageFiles.length === 0) {
      addLog('No GUID files loaded yet');
      return;
    }

    const testFile = imageFiles[0];
    addLog(`=== Testing single GUID file: ${testFile} ===`);

    try {
      const response = await fetch(`/captchas/${testFile}`);
      addLog(`Response: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const blob = await response.blob();
        addLog(`File: ${blob.size} bytes, ${blob.type}`);

        // Try to display it
        const imgUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          addLog(`✓ Image dimensions: ${img.width}x${img.height}`);
          URL.revokeObjectURL(imgUrl);
        };
        img.onerror = () => {
          addLog('✗ Not a valid image');
          URL.revokeObjectURL(imgUrl);
        };
        img.src = imgUrl;
      }
    } catch (error) {
      addLog(`Test failed: ${error.message}`);
    }
  };

  // Get a list of actual GUIDs from your folder
  const getActualGUIDs = () => {
    addLog('=== To get your actual GUID filenames ===');
    addLog('1. Open your terminal/command prompt');
    addLog('2. Navigate to your project folder');
    addLog('3. Run one of these commands:');
    addLog('');
    addLog('   On Mac/Linux:');
    addLog('   ls public/captchas/*.png | head -20');
    addLog('');
    addLog('   On Windows (PowerShell):');
    addLog('   Get-ChildItem public\\captchas\\*.png | Select-Object -First 20 Name');
    addLog('');
    addLog('4. Copy the output and paste into the knownGUIDs array');
  };

  // Rest of your component (runBenchmark, etc.) remains the same
  const runBenchmark = async () => {
    if (imageFiles.length === 0) {
      addLog('No GUID files to process');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults({
      totalTime: 0,
      successful: 0,
      failed: 0,
      averageTime: 0,
      requestsPerSecond: 0
    });
    setLog([]);

    addLog(`Starting benchmark with ${imageFiles.length} GUID files`);

    try {
      const startTime = Date.now();

      const { results: processedResults, successful, failed } = await processImageBatch(imageFiles, 200);

      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;

      const successfulRequests = processedResults
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => r.value);

      const totalProcessingTime = successfulRequests.reduce(
        (sum, r) => sum + r.time, 0
      );

      const averageTime = successfulRequests.length > 0
        ? totalProcessingTime / successfulRequests.length
        : 0;

      const requestsPerSecond = totalTime > 0 ? successful / totalTime : 0;

      setResults({
        totalTime,
        successful,
        failed,
        averageTime,
        requestsPerSecond
      });

      addLog(`=== PERFORMANCE RESULTS ===`);
      addLog(`Total time: ${totalTime.toFixed(2)} seconds`);
      addLog(`Successful: ${successful}, Failed: ${failed}`);
      addLog(`Success rate: ${((successful / imageFiles.length) * 100).toFixed(1)}%`);
      addLog(`Average time per request: ${averageTime.toFixed(2)}ms`);
      addLog(`Requests per second: ${requestsPerSecond.toFixed(2)}`);

    } catch (error) {
      addLog(`Performance test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        OCR Performance Test (GUID Files)
      </h1>

      {/* Debug Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={testSingleGUID}
          disabled={imageFiles.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: imageFiles.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Test Single GUID
        </button>
        <button
          onClick={getActualGUIDs}
          style={{
            padding: '8px 16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          How to Get GUIDs
        </button>
      </div>

      {/* Results Summary - Same as before */}
      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px'
      }}>
        {/* ... Keep your existing results UI ... */}

        <button
          onClick={runBenchmark}
          disabled={isRunning || imageFiles.length === 0}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isRunning ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning
            ? `Processing ${imageFiles.length} Images...`
            : `Run Benchmark with ${imageFiles.length} GUID Files`
          }
        </button>
      </div>

      {/* Log Output */}
      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          Processing Log
        </h2>
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          padding: '16px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {log.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center' }}>
              Loading GUID filenames...
            </div>
          ) : (
            log.map((entry, index) => (
              <div key={index} style={{
                padding: '4px 0',
                borderBottom: index < log.length - 1 ? '1px solid #e5e7eb' : 'none',
                color: entry.includes('✓') ? '#16a34a' :
                  entry.includes('✗') ? '#dc2626' :
                    entry.includes('===') ? '#2563eb' :
                      entry.includes('ACTION REQUIRED') ? '#dc2626' : '#000'
              }}>
                {entry}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleCaptcha;