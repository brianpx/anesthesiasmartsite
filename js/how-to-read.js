/**
 * How to read a paper: one selected trial, worked notes, and a call to make.
 */
const HowToRead = {
  current: 'grape',
  announced: false,

  papers: {
    grape: {
      label: 'Grape 2021',
      citation: 'Grape S, Kirkham KR, Akiki L, Albrecht E. J Clin Anesth. 2021.',
      scene: 'A laparoscopic cholecystectomy. You can infiltrate the wounds, or you can place a TAP block.',
      links: [
        { href: 'https://pubmed.ncbi.nlm.nih.gov/34243030/', label: 'PubMed', external: true },
        { href: '/journal-club/session.html?id=2026-10-06', label: 'October 6 handout' },
      ],
      steps: {
        decision: {
          kind: 'text',
          paragraphs: [
            'The decision is which local-anesthetic technique to use for a laparoscopic cholecystectomy: a TAP block, or infiltration of the wounds. It is not a question about liposomal bupivacaine, and it is not a question about anesthetic depth.',
          ],
        },
        pico: {
          kind: 'pico',
          prompt: 'What comparison, and what primary outcome, did Grape actually run?',
          hit: 'Yes. That is the comparison.',
          miss: 'That is a different study.',
          note: [
            'Ten trials, 668 patients. Adding a TAP block on top of infiltration was not the comparison.',
          ],
          fields: [
            ['Population', 'Adults in trials of laparoscopic cholecystectomy'],
            ['Intervention', 'TAP block'],
            ['Comparison', 'Local anesthetic wound infiltration'],
            ['Outcomes', 'Pain at rest, later pain, opioid use, nausea and vomiting'],
            ['Time', 'Primary outcome at 2 hours. Also 12 and 24 hours'],
          ],
          choices: [
            { text: 'TAP block versus saline before mixed major abdominal surgery. Opioid use through 72 hours.', correct: false },
            { text: 'TAP block versus wound infiltration after laparoscopic cholecystectomy. Pain at rest at 2 hours, on a 0–10 scale.', correct: true },
            { text: 'TAP block plus wound infiltration versus wound infiltration alone. Pain at 24 hours.', correct: false },
          ],
        },
        design: {
          kind: 'text',
          paragraphs: [
            'Grape is a systematic review and meta-analysis of 10 trials and 668 patients having laparoscopic cholecystectomy. Pooling can make a small pain difference look settled. It does not turn the result into evidence about other operations.',
          ],
        },
        validity: {
          kind: 'bullets',
          paragraphs: [
            'A meta-analysis still has to be read for bias. These are the limits you can see from the abstract.',
          ],
          items: [
            'The primary pain result is heterogeneous across the 10 trials (I² = 71%).',
            'The authors rate the evidence moderate to high.',
            'Data were too thin to compare infection, hematoma, visceral injury, or local anesthetic systemic toxicity.',
            'The review does not prove that every included trial blinded the patient and the person who scored the pain.',
          ],
        },
        result: {
          kind: 'judge',
          paragraphs: [
            'Pain at rest 2 hours after surgery was lower with a TAP block than with wound infiltration. The mean difference was −0.7 points on a 0–10 scale (95% CI −1.2 to −0.2).',
            'Pain at rest was also lower at 12 and 24 hours, and pain with movement was lower at 24 hours. Morphine use and postoperative nausea and vomiting were lower with the TAP block. The abstract does not give the morphine difference in milligrams.',
          ],
          prompt: 'On the next laparoscopic cholecystectomy, what does this review support?',
          hit: 'That is the reading.',
          miss: 'That reaches past the review.',
          note: [
            'A difference of 0.7 points is statistically significant here, and it is smaller than the 1-to-2-point change many clinicians want before they switch technique. Less morphine and less nausea belong in the same sentence. They still belong to this operation, compared with wound infiltration, not with no local anesthetic at all.',
          ],
          choices: [
            { text: 'Prefer a TAP block to wound infiltration for this operation. Do not use the review as a reason to place a TAP block before other abdominal operations.', correct: true },
            { text: 'Place a preincision TAP block before every major abdominal operation. The pooled result is precise enough to travel.', correct: false },
            { text: 'Skip both techniques. A difference under 1 point means the block does nothing.', correct: false },
          ],
        },
        apply: {
          kind: 'judge',
          paragraphs: [
            'The patients were adults having laparoscopic cholecystectomy. The outcome that drove the review was early pain, plus opioid use and nausea.',
          ],
          prompt: 'You already infiltrate the port sites. A colleague says Grape means you should add a TAP block as well. What do you say?',
          hit: 'That is the limit of the comparison.',
          miss: 'That is not what the trials compared.',
          note: [
            'If you stop infiltrating and place a TAP block instead, that is the comparison Grape ran. Adding a TAP block while you keep infiltrating is a different study. CLEVELAND is the trial for a TAP block before mixed major abdominal surgery, and it did not separate from saline.',
          ],
          choices: [
            { text: 'Grape compared the two techniques with each other. It did not test a TAP block added on top of wound infiltration.', correct: true },
            { text: 'Add the block. The review’s intervention was a TAP block plus infiltration.', correct: false },
            { text: 'Stop infiltrating, and skip the TAP block too. The 0.7-point difference means neither technique is worth doing.', correct: false },
          ],
        },
        bluf: {
          kind: 'bluf',
          model: 'For laparoscopic cholecystectomy, Grape finds a TAP block a bit better than wound infiltration: about 0.7 points less pain at 2 hours, with less morphine and less nausea. I would not use that review to place a routine TAP block before other abdominal operations.',
        },
      },
    },

    cleveland: {
      label: 'CLEVELAND 2026',
      citation: 'Turan A, et al., for the CLEVELAND Trial Group. Anesthesiology. 2026.',
      scene: 'Major abdominal surgery, open or laparoscopic. Someone asks for a four-quadrant TAP block before incision, and for liposomal bupivacaine rather than plain.',
      links: [
        { href: 'https://pubmed.ncbi.nlm.nih.gov/41329063/', label: 'PubMed', external: true },
        { href: '/journal-club/session.html?id=2026-10-06', label: 'October 6 handout' },
      ],
      steps: {
        decision: {
          kind: 'text',
          paragraphs: [
            'The decision is whether a bilateral four-quadrant TAP block, placed before incision, changes opioid use after major abdominal surgery, and whether liposomal bupivacaine changes it more than plain bupivacaine. Saline, injected the same way, is the control. This is not the cholecystectomy question.',
          ],
        },
        pico: {
          kind: 'pico',
          prompt: 'Which three arms did CLEVELAND randomize, and what was the coprimary outcome?',
          hit: 'Yes. Those are the arms.',
          miss: 'Those are someone else’s arms.',
          note: [
            'Everyone received a bilateral four-quadrant injection before incision. Saline was an arm, not the absence of a procedure.',
          ],
          fields: [
            ['Population', 'Adults having major open or laparoscopic abdominal surgery'],
            ['Intervention', 'Bilateral four-quadrant TAP block with liposomal bupivacaine, or the same block with plain bupivacaine'],
            ['Comparison', 'The same block with saline'],
            ['Outcomes', 'Opioid use, then pain scores'],
            ['Time', 'First 24 hours, and from 24 to 48 hours. Pain and opioids also to 72 hours'],
          ],
          choices: [
            { text: 'Wound infiltration, a TAP block, or no local anesthetic, for laparoscopic cholecystectomy only. Pain at 2 hours.', correct: false },
            { text: 'BIS 50, BIS 35, or usual care. Delirium on days 1 through 5.', correct: false },
            { text: 'A bilateral four-quadrant TAP block with liposomal bupivacaine, plain bupivacaine, or saline, before major open or laparoscopic abdominal surgery. Opioid use in the first 24 hours, and from 24 to 48 hours.', correct: true },
          ],
        },
        design: {
          kind: 'text',
          paragraphs: [
            'CLEVELAND is a three-arm randomized trial. The modified intention-to-treat analysis included 261 patients: 89 assigned to liposomal bupivacaine, 84 to plain bupivacaine, and 88 to saline. The two coprimary comparisons are reported with a 97.7% confidence interval, not a 95% interval.',
          ],
        },
        validity: {
          kind: 'bullets',
          paragraphs: [
            'This is a block trial in which the control group still got the injection.',
          ],
          items: [
            'Patients, the clinicians who adjusted opioid analgesia, the ward nurses who scored pain, and the investigators were blinded.',
            'Every patient was injected. The control was saline, not an unblinded “no block.”',
            'Read the opioid result from the modified intention-to-treat cohort of 261 patients.',
          ],
        },
        result: {
          kind: 'judge',
          paragraphs: [
            'Opioid use in the first 24 hours, as a median with the interquartile range, was 26 mg morphine equivalents (18 to 48) with liposomal bupivacaine, 33 (13 to 75) with plain bupivacaine, and 31 (17 to 53) with saline.',
            'Liposomal bupivacaine versus saline: geometric-mean ratio 0.86 (97.7% CI 0.60 to 1.24; P = 0.355). Plain bupivacaine versus saline: 0.91 (97.7% CI 0.63 to 1.32; P = 0.578).',
            'Opioid use from 24 to 48 hours, pain scores, and opioid use from 48 to 72 hours were also similar.',
          ],
          prompt: 'What do you change for mixed major abdominal surgery?',
          hit: 'That matches the trial.',
          miss: 'That is a larger claim than the interval supports.',
          note: [
            'The liposomal-versus-saline interval runs from a 40% reduction to a 24% increase. It includes no difference, and it includes a reduction you might care about. It does not show a benefit you can count on, and it is too wide to call the drugs proven identical. The authors’ conclusion is that these single-shot blocks provided little analgesia in this mixed population. Grape remains the cholecystectomy comparison.',
          ],
          choices: [
            { text: 'Adopt liposomal bupivacaine as the default TAP drug. The point estimate was about 14% less opioid than saline.', correct: false },
            { text: 'Do not add a routine preincision four-quadrant TAP block with either drug for this mixed population on the basis of this trial.', correct: true },
            { text: 'Stop using TAP blocks for laparoscopic cholecystectomy. A null trial cancels Grape.', correct: false },
          ],
        },
        apply: {
          kind: 'judge',
          paragraphs: [
            'The operations were major open or laparoscopic abdominal procedures, including colorectal surgery, gynecologic surgery, and hernia repair. Blocks were placed before incision. Opioid and pain outcomes ran through 72 hours.',
          ],
          prompt: 'Tomorrow’s cholecystectomy is booked as a TAP block instead of wound infiltration. Does CLEVELAND answer it?',
          hit: 'Yes. CLEVELAND does not answer that booking.',
          miss: 'That imports CLEVELAND into a comparison it did not run.',
          note: [
            'Use CLEVELAND when the proposal is a routine preincision four-quadrant block for a similar major abdominal case. A cholecystectomy whose alternative is wound infiltration is Grape’s question, and Grape found a small advantage for the TAP block.',
          ],
          choices: [
            { text: 'No. CLEVELAND compared local anesthetic with saline inside a TAP block, in a mixed major-abdominal population. The cholecystectomy choice is Grape.', correct: true },
            { text: 'Yes. Any null TAP trial means wound infiltration and a TAP block are the same for cholecystectomy.', correct: false },
            { text: 'Yes. Order liposomal bupivacaine, because the point estimate favored it.', correct: false },
          ],
        },
        bluf: {
          kind: 'bluf',
          model: 'I would not place a routine preincision four-quadrant TAP block with liposomal or plain bupivacaine for mixed major abdominal surgery on the basis of CLEVELAND. Opioid use at 24 hours did not separate from saline, and the interval still includes a modest reduction.',
        },
      },
    },

    evered: {
      label: 'Evered 2021',
      citation: 'Evered LA, et al. Br J Anaesth. 2021.',
      scene: 'An adult over 60, ASA III or IV, booked for major surgery lasting more than two hours. You can aim the BIS at 50 or at 35.',
      links: [
        { href: 'https://pubmed.ncbi.nlm.nih.gov/34465469/', label: 'PubMed', external: true },
        { href: '/journal-club/session.html?id=2026-01-27', label: 'January 27 handout' },
      ],
      steps: {
        decision: {
          kind: 'text',
          paragraphs: [
            'The decision is whether to target a BIS of 50 or a BIS of 35 during major surgery in older, higher-risk adults, to reduce postoperative delirium. The deep arm is not usual care without a BIS target. That other question is ENGAGES.',
          ],
        },
        pico: {
          kind: 'pico',
          prompt: 'Who was randomized, and what were the two arms?',
          hit: 'Yes. BIS 50 versus BIS 35.',
          miss: 'That is a different control arm.',
          note: [
            'Light versus deep, in this trial, means a BIS target of 50 versus a BIS target of 35. There is no usual-care arm.',
          ],
          fields: [
            ['Population', 'Adults 60 and older, ASA III–IV, major noncardiac surgery expected to last at least 2 hours'],
            ['Intervention', 'Volatile general anesthesia targeted to BIS 50'],
            ['Comparison', 'Volatile general anesthesia targeted to BIS 35'],
            ['Outcomes', 'Postoperative delirium. Also cognition, mortality, length of stay, ICU admission'],
            ['Time', 'Delirium on any of the first 5 postoperative days. Cognition at discharge, 30 days, and 1 year'],
          ],
          choices: [
            { text: 'Adults 60 and older having major surgery. EEG-guided anesthesia versus usual care with no mandated EEG target.', correct: false },
            { text: 'Adults 60 and older, ASA III–IV, major noncardiac surgery expected to last at least 2 hours. Volatile anesthesia targeted to BIS 50 versus BIS 35. Delirium on any of the first 5 postoperative days.', correct: true },
            { text: 'Adults having hip-fracture repair. Spinal versus general anesthesia. Survival at 1 year.', correct: false },
          ],
        },
        design: {
          kind: 'text',
          paragraphs: [
            'Evered is a multicenter randomized trial, 655 patients at eight centers in three countries. It is the delirium substudy of BALANCED. Delirium was assessed for 5 days with the 3-minute confusion assessment method or the CAM-ICU.',
          ],
        },
        validity: {
          kind: 'bullets',
          paragraphs: [
            'The handout’s appraisal of the methods, kept because the abstract does not repeat them:',
          ],
          items: [
            'Randomization was computer-generated and allocation was concealed.',
            'Patients and outcome assessors were blinded. The anesthesia clinician was not.',
            'Baseline age, comorbidities, cognition, and surgical type and duration were similar.',
            'Analysis was intention-to-treat, with little crossover or missing delirium data.',
            'The comparison is a BIS target of 50 versus a BIS target of 35. It is not usual care without a BIS target.',
          ],
        },
        result: {
          kind: 'judge',
          paragraphs: [
            'Delirium on any of the first 5 postoperative days was 19% with a BIS target of 50 and 28% with a BIS target of 35 (odds ratio 0.58, 95% CI 0.38 to 0.88; P = 0.010).',
            'That is 9 fewer patients with delirium per 100 assigned to the lighter target. At 1 year, an Abbreviated Mental Test score of 6 or less was 9% versus 20%.',
          ],
          prompt: 'What change does this trial support?',
          hit: 'That is the contrast the trial ran.',
          miss: 'That swaps in a different result.',
          note: [
            'Do not shrink 19% versus 28% into a few percent. Do not paste the result onto ENGAGES. ENGAGES compared EEG-guided anesthesia with usual care, and delirium there was 26% versus 23%.',
          ],
          choices: [
            { text: 'Treat the result as 4% to 6% in both arms, too small to discuss.', correct: false },
            { text: 'Quote ENGAGES instead: EEG guidance was 26% and usual care was 23%, so stop targeting a BIS of 50.', correct: false },
            { text: 'Prefer a BIS target of 50 to a BIS target of 35 in a patient like this trial. Do not describe the deep arm as usual care.', correct: true },
          ],
        },
        apply: {
          kind: 'judge',
          paragraphs: [
            'The trial enrolled adults about 60 and older, ASA III–IV, having major noncardiac surgery expected to last at least 2 hours. Delirium and later cognition are patient-centered outcomes.',
          ],
          prompt: 'An 80-year-old is having a three-hour colectomy. Your colleague says Evered shows that usual care causes more delirium than a BIS of 50. What do you say?',
          hit: 'The patient fits. The sentence does not.',
          miss: 'That misstates the control arm or the operations.',
          note: [
            'Use Evered when you can run a BIS target and the alternative on offer is a deeper target. If the alternative is usual practice with no target, you are in ENGAGES, not in Evered.',
          ],
          choices: [
            { text: 'The patient fits the age and the operation. Usual care was not an arm. The arms were BIS 50 and BIS 35.', correct: true },
            { text: 'Agree. The deep arm was whatever the clinician usually does.', correct: false },
            { text: 'Set the trial aside. It enrolled cardiac surgery only.', correct: false },
          ],
        },
        bluf: {
          kind: 'bluf',
          model: 'For an older adult having major surgery I would target a BIS of 50 rather than 35. Delirium was 19% versus 28%. That comparison is not EEG guidance versus usual care.',
        },
      },
    },

    engages: {
      label: 'ENGAGES 2019',
      citation: 'Wildes TS, et al., for the ENGAGES Research Group. JAMA. 2019.',
      scene: 'An adult over 60 having major surgery. Usual care in this trial did not mandate an EEG target. You can run EEG-guided anesthesia or leave the anesthetic to usual care.',
      links: [
        { href: 'https://pubmed.ncbi.nlm.nih.gov/30721296/', label: 'PubMed', external: true },
        { href: '/journal-club/session.html?id=2026-01-27', label: 'January 27 handout' },
      ],
      steps: {
        decision: {
          kind: 'text',
          paragraphs: [
            'The decision is whether EEG-guided anesthesia, used to limit EEG suppression, reduces delirium compared with usual anesthetic care. It is not a trial of BIS 50 versus BIS 35.',
          ],
        },
        pico: {
          kind: 'pico',
          prompt: 'What was the control arm in ENGAGES?',
          hit: 'Yes. Usual care, with no mandated target.',
          miss: 'That control arm belongs to a different trial.',
          note: [
            'The primary outcome was incident delirium during postoperative days 1 through 5, assessed in 1,213 of 1,232 randomized patients.',
          ],
          fields: [
            ['Population', 'Adults 60 and older having major surgery under general anesthesia at one US academic center'],
            ['Intervention', 'EEG-guided anesthesia aimed at limiting EEG suppression and excessive depth'],
            ['Comparison', 'Usual anesthetic care, without a mandated EEG target'],
            ['Outcomes', 'Postoperative delirium. Also EEG suppression, anesthetic dose, hypotension, awareness, complications'],
            ['Time', 'Delirium on postoperative days 1–5. Other outcomes through the stay and 30 days'],
          ],
          choices: [
            { text: 'Usual anesthetic care, with no mandated EEG target, in adults 60 and older having major surgery. Delirium on postoperative days 1 through 5.', correct: true },
            { text: 'A mandated BIS target of 35, with the other arm defined as BIS 50.', correct: false },
            { text: 'Spinal anesthesia, as a way of giving less general anesthetic.', correct: false },
          ],
        },
        design: {
          kind: 'text',
          paragraphs: [
            'ENGAGES is a randomized trial of 1,232 adults aged 60 and older having major surgery under general anesthesia at one US academic hospital. The primary outcome was assessed in 1,213 patients (98.5%).',
          ],
        },
        validity: {
          kind: 'bullets',
          paragraphs: [
            'The guidance changed the anesthetic. It did not change delirium.',
          ],
          items: [
            'Randomization was centralized and allocation was concealed. Patients and delirium assessors were blinded. The anesthesia clinician was not.',
            'Baseline age, frailty, cognition, and surgical and anesthetic characteristics were similar.',
            'The analysis was a modified intention-to-treat of randomized patients who had surgery. Some EEG targets were not met. Missing delirium assessments were balanced.',
            'Median end-tidal volatile concentration was 0.69 MAC with guidance and 0.80 MAC with usual care. Median time with EEG suppression was 7 versus 13 minutes. Time with mean arterial pressure below 60 mm Hg was 7 minutes in both arms.',
          ],
        },
        result: {
          kind: 'judge',
          paragraphs: [
            'Delirium on days 1 through 5 was 26.0% with EEG guidance (157 of 604) and 23.0% with usual care (140 of 609). The difference was 3.0 percentage points (95% CI −2.0 to 8.0; P = 0.22).',
            'Undesirable movement was more common with guidance (22.3% versus 15.4%). No patient reported intraoperative awareness. The abstract also records 4 deaths within 30 days in the guided group and 19 in the usual-care group. Those deaths are not the delirium result.',
          ],
          prompt: 'What do you do with this primary result?',
          hit: 'That keeps the primary result in its place.',
          miss: 'That reads a different outcome, or a different trial, as the result.',
          note: [
            'Less anesthetic and less suppression did not come with less delirium. A p-value of 0.22 does not mean the rates were the same. It means this trial did not show a benefit. The 30-day deaths are a secondary count. They do not turn a null delirium result into a positive one, and they do not belong in the BLUF unless you name them as secondary.',
          ],
          choices: [
            { text: 'Do not add EEG-guided anesthesia only to prevent delirium. The interval runs from a small reduction to an 8-point increase. Do not use this trial to decide between a BIS of 50 and a BIS of 35.', correct: true },
            { text: 'The p-value is above 0.05, so the groups were identical and the monitor has no effect of any kind.', correct: false },
            { text: 'Suppression time fell, so delirium fell. Quote the monitor, not the 26% and the 23%.', correct: false },
          ],
        },
        apply: {
          kind: 'judge',
          paragraphs: [
            'The trial enrolled adults 60 and older having major surgery, mostly noncardiac, in a US academic practice where usual care did not mandate an EEG target.',
          ],
          prompt: 'You already watch the EEG and avoid long burst suppression. A resident says ENGAGES overturns Evered, so aim deeper. What do you say?',
          hit: 'The trials asked different questions.',
          miss: 'That collapses two control arms into one.',
          note: [
            'ENGAGES was published in 2019 and Evered in 2021. The date is not why they disagree. The control arm is. Usual care with no target is not a BIS of 35.',
          ],
          choices: [
            { text: 'ENGAGES is the newer trial, so a BIS of 35 is now the safer target.', correct: false },
            { text: 'Keep the questions apart. ENGAGES did not beat usual care. Evered still found less delirium at a BIS of 50 than at a BIS of 35.', correct: true },
            { text: 'Both trials show that any EEG number prevents delirium.', correct: false },
          ],
        },
        bluf: {
          kind: 'bluf',
          model: 'I would not add EEG-guided anesthesia only to prevent delirium. In ENGAGES, delirium was 26% with guidance and 23% with usual care, and the interval crosses no difference. I would still not treat a BIS of 35 as the safer target. That is Evered’s question, and it went the other way.',
        },
      },
    },

    regain: {
      label: 'REGAIN',
      citation: 'Vail EA, et al. Anesthesiology. 2024. Neuman MD, et al. Ann Intern Med. 2022.',
      scene: 'A patient over 50 who was walking before a hip fracture. You can offer spinal or general anesthesia. The list also has an elective hip replacement. That second patient is the applicability check.',
      links: [
        { href: 'https://pubmed.ncbi.nlm.nih.gov/37831596/', label: 'Vail, PubMed', external: true },
        { href: 'https://pubmed.ncbi.nlm.nih.gov/35696684/', label: 'Neuman, PubMed', external: true },
        { href: '/journal-club/session.html?id=2025-09-09', label: 'September 9 handout' },
      ],
      steps: {
        decision: {
          kind: 'text',
          paragraphs: [
            'The decision is whether spinal or general anesthesia changes survival, walking, pain, or satisfaction after hip-fracture surgery in someone who was walking before the fracture. It is not a prescription for elective total hip arthroplasty.',
          ],
        },
        pico: {
          kind: 'pico',
          prompt: 'Which patients, and which outcomes, are actually in these REGAIN reports?',
          hit: 'Yes. Fracture surgery, spinal versus general.',
          miss: 'That is a different operation.',
          note: [
            'Read Vail for survival and walking. Read Neuman for pain, analgesic use, and satisfaction. Read Haslam as a review of elective hip replacement, not as a third arm of this trial.',
          ],
          fields: [
            ['Population', 'Adults 50 and older who were walking before a hip fracture, at 46 US and Canadian hospitals'],
            ['Intervention', 'Spinal anesthesia'],
            ['Comparison', 'General anesthesia'],
            ['Outcomes', 'Vail: survival, walking, disability, nursing-home residence. Neuman: pain, prescription analgesic use, satisfaction'],
            ['Time', 'Vail to 365 days. Neuman: pain on days 1–3, then pain, analgesic use, and satisfaction at 60, 180, and 365 days'],
          ],
          choices: [
            { text: 'Elective primary total hip arthroplasty. Neuraxial anesthesia versus general anesthesia alone, inside an ERAS pathway. Complications and length of stay.', correct: false },
            { text: 'Adults 50 and older who had been walking, having hip-fracture surgery. Spinal versus general anesthesia. Vail reports survival and walking out to 365 days. Neuman reports pain, prescription analgesic use, and satisfaction.', correct: true },
            { text: 'Adults having laparoscopic cholecystectomy. A TAP block versus wound infiltration.', correct: false },
          ],
        },
        design: {
          kind: 'text',
          paragraphs: [
            'REGAIN is a pragmatic randomized trial of 1,600 patients. Vail 2024 is a prespecified analysis of outcomes out to 365 days: 795 patients were assigned to spinal anesthesia and 805 to general anesthesia. Neuman 2022 is a preplanned secondary analysis of pain, analgesic use, and satisfaction. Haslam 2024 is an education review of elective hip replacement. It is not a randomized trial, and it does not estimate a hazard ratio.',
          ],
        },
        validity: {
          kind: 'bullets',
          paragraphs: [
            'Two measurement problems matter more here than a p-value.',
          ],
          items: [
            'Vail analyzed patients as randomized. A patient assigned to spinal anesthesia who receives general anesthesia stays in the spinal arm. That crossover can shrink a difference that was real in the operating room.',
            'Outcome assessors and the analysts were masked in the long-term report. The patient and the team in the room know which anesthetic was given, so pain on the first day is a softer measurement than death at one year.',
            'Vital status at about 365 days was available for 1,427 of 1,599 patients who had surgery (89.2%).',
            'The pain report names its own limits: missing outcome data, and more than one outcome.',
          ],
        },
        result: {
          kind: 'judge',
          paragraphs: [
            'At 365 days there were 98 deaths in the spinal arm and 92 in the general arm (hazard ratio 1.08, 95% CI 0.81 to 1.44; P = 0.59). Walking among people who survived the year did not differ (adjusted odds ratio 0.87, 95% CI 0.67 to 1.14).',
            'Worst pain in the first 24 hours was 0.40 points higher with spinal anesthesia on a 0–10 scale (95% CI 0.12 to 0.68). Severe pain was common either way: 73.5% of patients reported it in that first day. Pain did not differ at the later time points.',
            'Prescription analgesic use at 60 days was 25% after spinal anesthesia (141 of 563) and 18.8% after general anesthesia (108 of 574), relative risk 1.33 (95% CI 1.06 to 1.65). Satisfaction was similar.',
          ],
          prompt: 'A colleague asks which anesthetic is safer for a similar hip fracture. What do you quote?',
          hit: 'That is the size of the result.',
          miss: 'That inflates one piece and drops the interval.',
          note: [
            'The survival interval runs from a modest benefit of spinal anesthesia to a modest harm. A 0.4-point pain difference is small next to how common severe pain already was. The day-60 analgesic difference is larger than the pain-score difference, and it is still not a survival result.',
          ],
          choices: [
            { text: 'Spinal anesthesia cuts one-year mortality roughly in half. Lead with that.', correct: false },
            { text: 'Survival and walking at one year were similar. Early pain was a little worse with spinal anesthesia, analgesic use at 60 days was higher, and satisfaction was similar.', correct: true },
            { text: 'Spinal anesthesia caused much worse pain, so stop offering it for hip fracture.', correct: false },
          ],
        },
        apply: {
          kind: 'judge',
          paragraphs: [
            'Vail enrolled patients 50 and older who had been walking. In the pain report the average age was 78, and 77% were women. The operation was hip-fracture surgery, not a planned hip replacement.',
          ],
          prompt: 'Two patients are on tomorrow’s list. A 78-year-old who walked before a hip fracture. A 68-year-old for elective total hip arthroplasty on an ERAS pathway. Where does REGAIN apply?',
          hit: 'Fracture and elective replacement stay apart.',
          miss: 'That moves a fracture result onto the wrong operation, or treats a review as the trial.',
          note: [
            'Hip fracture is not elective total hip arthroplasty. Haslam reviews a pathway for the planned replacement. It does not cancel, and it does not confirm, the REGAIN hazard ratio.',
          ],
          choices: [
            { text: 'Both patients. Offer general anesthesia as equivalent for the elective hip.', correct: false },
            { text: 'Neither patient. Haslam is the trial, and it showed that spinal anesthesia is unsafe after a fracture.', correct: false },
            { text: 'The fracture patient. For the elective hip, do not import the fracture result. This session reads that case with Haslam: neuraxial or regional anesthesia inside an ERAS pathway, not general anesthesia alone.', correct: true },
          ],
        },
        bluf: {
          kind: 'bluf',
          model: 'For a patient who was walking before a hip fracture, I would offer spinal or general anesthesia. One-year survival and walking were similar, early pain was slightly worse with spinal anesthesia, and satisfaction was similar. I would not carry that result to an elective hip replacement on an ERAS pathway.',
        },
      },
    },
  },

  init() {
    this.root = document.querySelector('.jc-work');
    if (!this.root) return;
    this.citeEl = document.getElementById('jc-work-cite');
    this.sceneEl = document.getElementById('jc-work-scene');
    this.statusEl = document.getElementById('jc-work-status');
    Object.values(this.papers).forEach((paper) => {
      ['pico', 'result', 'apply'].forEach((key) => {
        const count = paper.steps[key].choices.filter((choice) => choice.correct).length;
        if (count !== 1) throw new Error(`${paper.label} ${key} has ${count} correct choices`);
      });
    });
    this.root.querySelector('.jc-work-papers').addEventListener('click', (event) => {
      const button = event.target.closest('[data-paper]');
      if (!button) return;
      this.select(button.dataset.paper);
    });
    document.getElementById('jc-work-reset').addEventListener('click', () => {
      this.select(this.current, 'Answers cleared.');
    });
    this.select('grape');
  },

  select(id, message) {
    const paper = this.papers[id];
    if (!paper) return;
    this.current = id;
    this.root.querySelectorAll('[data-paper]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.paper === id ? 'true' : 'false');
    });
    this.fillCite(paper);
    const dirty = this.isDirty();
    this.sceneEl.textContent = paper.scene;
    document.querySelectorAll('.jc-onpaper').forEach((mount) => {
      this.renderStep(mount, paper.steps[mount.dataset.step], paper);
    });
    if (message) this.statusEl.textContent = message;
    else if (this.announced) {
      this.statusEl.textContent = dirty
        ? `Now on ${paper.label}. Answers cleared.`
        : `Now on ${paper.label}.`;
    } else this.statusEl.textContent = '';
    this.announced = true;
    this.syncReset();
  },

  isDirty() {
    const typed = document.querySelector('#jc-bluf')?.value.trim();
    return Boolean(document.querySelector('.jc-choices[data-answered]') || typed);
  },

  syncReset() {
    document.getElementById('jc-work-reset').hidden = !this.isDirty();
  },

  fillCite(paper) {
    this.citeEl.replaceChildren(document.createTextNode(`${paper.citation} `));
    paper.links.forEach((link, index) => {
      if (index) this.citeEl.append(document.createTextNode(' '));
      const anchor = document.createElement('a');
      anchor.className = 'jc-link';
      anchor.href = link.href;
      anchor.textContent = link.label;
      if (link.external) {
        anchor.target = '_blank';
        anchor.rel = 'noopener';
      }
      this.citeEl.append(anchor, document.createTextNode('.'));
    });
  },

  renderStep(mount, step) {
    mount.replaceChildren();
    mount.append(this.el('p', 'jc-kicker', this.papers[this.current].label));
    if (step.kind === 'text' || step.kind === 'bullets' || step.kind === 'judge') {
      step.paragraphs.forEach((text) => mount.append(this.el('p', null, text)));
    }
    if (step.kind === 'bullets') {
      const list = this.el('ul', 'jc-points');
      step.items.forEach((item) => list.append(this.el('li', null, item)));
      mount.append(list);
    }
    if (step.kind === 'pico') this.renderChoices(mount, step, true);
    if (step.kind === 'judge') this.renderChoices(mount, step, false);
    if (step.kind === 'bluf') this.renderBluf(mount, step);
  },

  renderChoices(mount, step, withPico) {
    const prompt = this.el('p', 'jc-prompt', step.prompt);
    prompt.id = `jc-q-${mount.dataset.step}`;
    const choices = this.el('div', 'jc-choices');
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-labelledby', prompt.id);
    const feedback = this.el('div', 'jc-feedback');
    feedback.hidden = true;
    feedback.tabIndex = -1;
    step.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jc-choice';
      button.textContent = choice.text;
      button.addEventListener('click', () => this.answer(choices, button, choice, step, feedback, mount));
      choices.append(button);
    });
    mount.append(prompt, choices);
    if (withPico) mount.append(this.picoDetails(step));
    mount.append(feedback);
  },

  answer(choices, button, choice, step, feedback, mount) {
    if (choices.dataset.answered) return;
    choices.dataset.answered = '1';
    button.setAttribute('aria-pressed', 'true');
    [...choices.querySelectorAll('button')].forEach((item, index) => {
      item.setAttribute('aria-disabled', 'true');
      if (step.choices[index].correct) {
        item.classList.add('is-key');
        item.append(this.el('span', 'jc-sr', ' Supported reading.'));
      }
    });
    if (!choice.correct) button.append(this.el('span', 'jc-sr', ' Your answer.'));
    feedback.hidden = false;
    feedback.replaceChildren(this.el('p', 'jc-hit', choice.correct ? step.hit : step.miss));
    step.note.forEach((text) => feedback.append(this.el('p', null, text)));
    const details = mount.querySelector('details');
    if (details) details.open = true;
    this.syncReset();
    feedback.focus();
  },

  picoDetails(step) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Show the PICO';
    const list = this.el('dl', 'jc-pico-mini');
    step.fields.forEach(([term, text]) => {
      list.append(this.el('dt', null, term), this.el('dd', null, text));
    });
    details.append(summary, list);
    details.addEventListener('toggle', () => {
      summary.textContent = details.open ? 'Hide the PICO' : 'Show the PICO';
    });
    return details;
  },

  renderBluf(mount, step) {
    const label = this.el('label', 'jc-bluf-label', 'Your sentence');
    const input = document.createElement('textarea');
    input.className = 'jc-bluf-input';
    input.id = 'jc-bluf';
    label.htmlFor = input.id;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'jc-button';
    button.textContent = 'Show a model sentence';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'jc-bluf-model');
    const feedback = this.el('div', 'jc-feedback');
    feedback.id = 'jc-bluf-model';
    feedback.hidden = true;
    feedback.tabIndex = -1;
    const cue = this.el('p', 'jc-hit', '');
    feedback.append(cue, this.el('p', null, step.model));
    input.addEventListener('input', () => this.syncReset());
    button.addEventListener('click', () => {
      const opening = feedback.hidden;
      feedback.hidden = !opening;
      button.textContent = opening ? 'Hide the model sentence' : 'Show a model sentence';
      button.setAttribute('aria-expanded', opening ? 'true' : 'false');
      cue.textContent = input.value.trim()
        ? 'Set this beside the sentence you wrote.'
        : 'The box is empty. Here is one sentence you could say.';
      if (opening) feedback.focus();
    });
    mount.append(label, input, button, feedback);
  },

  el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  },
};

HowToRead.init();
