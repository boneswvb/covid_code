// const mydata = {
//   adata: {
//     region: {
//       name: 'Africa',
//       avgAge: 19.7,
//       avgDailyIncomeInUSD: 5,
//       avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'days',
//     timeToElapse: 10,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
//   }
// };
const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  const {
    periodType,
    timeToElapse,
    totalHospitalBeds,
    reportedCases
  } = data;
  const {
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD
  } = data.region;
  const calculateTimeToElapse = () => {
    let elapseTime = 0;
    if (periodType === 'days') {
      elapseTime = timeToElapse;
    } else if (periodType === 'weeks') {
      elapseTime = timeToElapse * 7;
    } else if (periodType === 'months') {
      elapseTime = timeToElapse * 30;
    }
    return (elapseTime);
  };
  calculateTimeToElapse();
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  impact.infectionsByRequestedTime = impact
    .currentlyInfected * 2 ** Math.floor(calculateTimeToElapse() / 3);
  severeImpact.infectionsByRequestedTime = severeImpact
    .currentlyInfected * 2 ** Math.floor(calculateTimeToElapse() / 3);
  impact.severeCasesByRequestedTime = Math.floor(0.15 * impact
    .infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = Math.floor(0.15 * severeImpact
    .infectionsByRequestedTime);
  const impactHospitalBeds = () => {
    const impactAvailableBeds = (35 / 100) * totalHospitalBeds - impact
      .severeCasesByRequestedTime;
    return (Math.trunc(impactAvailableBeds));
  };
  impact.hospitalBedsByRequestedTime = impactHospitalBeds(data);
  const severeHospitalBeds = () => {
    const SevereImpactAvailableBeds = (35 / 100) * totalHospitalBeds - severeImpact
      .severeCasesByRequestedTime;
    return (Math.trunc(SevereImpactAvailableBeds));
  };
  severeImpact.hospitalBedsByRequestedTime = severeHospitalBeds(data);
  impact.casesForICUByRequestedTime = Math.floor(0.05 * impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.floor(0.05 * severeImpact
    .infectionsByRequestedTime);
  impact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * impact
    .infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * severeImpact
    .infectionsByRequestedTime);
  impact.dollarsInFlight = Math.floor(
    (
      impact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD
    )
      / calculateTimeToElapse()
  );
  severeImpact.dollarsInFlight = Math.floor(
    (
      severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD
    )
      / calculateTimeToElapse()
  );
  // console.log('impact', impact)
  // console.log('severeImpact', severeImpact)
  return {
    data,
    impact,
    severeImpact
  };
};
// covid19ImpactEstimator(mydata.adata);
export default covid19ImpactEstimator;
