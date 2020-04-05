import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {

  constructor() { }
  /**
   * @author Om kanada
   * @createdDate 26/8/2019
   * @description
   * function  check strength of user's password and return appropriate result.
   */
  public getStrength(pass) {
    let score = 0;
    let passwordtemp;
    // take reference variable for checking each and every condition in variation
    let isPassedAllCheck = true;
    if (!pass) {
      const result: any = {};
      result.type = '';
      result.score = 0;
      return result;
    }
    // award every unique letter until 5 repetitions
    let letters = new Object();

    for (const index in pass) {
      if (index) {
        letters[pass[index]] = (letters[pass[index]] || 0) + 1;
        score += 5.0 / letters[pass[index]];
      }

    }

    // bonus points for mixing it up
    let variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /[$@!%*?&.,():_-]/.test(pass),
    };
    let variationCount = 0;
    for (let check in variations) {
      if (variations.hasOwnProperty(check)) {
        variationCount += (variations[check] === true) ? 1 : 0;
        // check the one of the condition in variation is false
        if (variations[check] === false) {
          isPassedAllCheck = false;
        }
      }
    }
    score += (variationCount - 1) * 10;
    if (score > 100) { score = 100; }


    // if one of the condition in vaaition is false then
    if (isPassedAllCheck === false) {
      // if score is greater then 40 then set score it 40
      score = score > 40 ? 40 : score;
      // result
      const result: any = {};
      result.type = 'weak';
      result.score = score;
      return result;
    }

    // if password's score is less than 40 so password is weak
    if (score < 40) {
      passwordtemp = 'weak';
    } else if (score >= 40 && score < 70) {
      // if password's score is greater than 40 but less than 70 so password is ok.
      passwordtemp = 'ok';
    } else {
      // if password's score is greater than 70 so password is strong.
      passwordtemp = 'strong';
    }
    // Result
    const result: any = {};
    result.type = passwordtemp;
    result.score = score;
    return result;

  }
}
