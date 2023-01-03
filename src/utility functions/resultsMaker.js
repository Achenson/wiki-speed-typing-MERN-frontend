export default function resultsMaker(
    correct,
    incorrect,
    // unfixed mistakes (incorrectEntries_changable that are left unfixed)
    unfixed,
    allEntries,
    timerValue_current,
    constantTimerValue
  ) {
    // (constantTimerValue-timerValue) !!! crucial for displaying proper speed&accuracy live
    let noPenaltyKPM =
      Math.round(
        ((allEntries * 60) /
          (constantTimerValue - timerValue_current)) *
          100
      ) / 100;

    // older version -> counting also unfixed mistakes for speed
    /*   let incorrectPerMinute =
      (incorrect * 60) /
      (state.counter.constantTimerValue - timerValue_current);
    // speed penalty: -5 per incorrectEntry/minute (20% or more mistakes === 0KPM!)
    let penaltyKPM = noPenaltyKPM - 5 * incorrectPerMinute; */

    let unfixedPerMinute;

    if (unfixed <= 0) {
      unfixedPerMinute = 0;
    } else {
      unfixedPerMinute =
        (unfixed * 60) /
        (constantTimerValue - timerValue_current);
    }

    // speed penalty: -5 per incorrectEntry/minute (20% or more mistakes === 0KPM!)
    let penaltyKPM = noPenaltyKPM - 5 * unfixedPerMinute;

    return {
      speed: calcSpeed(),
      accuracy: calcAccuracy(),
      correct: correct,
      incorrect: incorrect,
      unfixed: unfixed,
      noPenalty: noPenaltyKPM,
      "timer length": constantTimerValue.toString(),
    };

    function calcSpeed() {
      if (penaltyKPM >= 0) {
        return Math.round(penaltyKPM * 10) / 10;
      } else {
        return 0;
      }
    }

    function calcAccuracy() {
      // correct and incorrect entries(also fixed mistakes count in this case!)
      if (allEntries > 0) {
        let accuracyResult = Math.round((correct / allEntries) * 1000) / 10;
        return accuracyResult;
      } else {
        return 0;
      }
    }
  }