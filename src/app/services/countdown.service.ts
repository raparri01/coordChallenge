import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CurrencyIndex } from "@angular/common/src/i18n/locale_data";

@Injectable({
  providedIn: "root"
})
export class CountdownService {
  averageCommitTime: number = 0;
  commitCount: number = 0;
  lastCommitTime: number = 0;
  timeUntilNCommit: number = 0;
  countdownDisplay: number = 0;
  constructor(private http: HttpClient) {}

  getCommitData() {
    return this.http.get("https://api.staging.coord.co/codechallenge/commits");
  }
  processCommitData(data) {
    this.lastCommitTime = data[0] * 1000;
    this.commitCount = data.length;
    //Method 1
    console.log(
      "Method 1 Average Commit Time: ",
      (data[0] - data[data.length - 1]) / data.length
    );

    //Method 2
    let timeBetweenCommits = [];
    for (let i = 1; i < data.length; i++) {
      timeBetweenCommits.push(data[i - 1] - data[i]);
    }
    console.log(
      "Method 2 Average Commit Time: ",
      timeBetweenCommits.reduce((total, item) => total + item, 0) /
        timeBetweenCommits.length
    );
    this.averageCommitTime = (timeBetweenCommits.reduce((total, item) => total + item, 0) / timeBetweenCommits.length) * 1000;
  }
  getTimeToNCommit(length, n, average){
    let remainingCommits = n - length - 1;
    let remainingTime = remainingCommits * average;
    this.timeUntilNCommit = remainingTime;

    return this.timeUntilNCommit;
  }
  getCommitDate(time){
    return Date.now() + time;
  }
  addCommit(){
    let commitTime = Date.now()
    this.averageCommitTime = (((this.averageCommitTime * this.commitCount) + (commitTime - this.lastCommitTime)) / (this.commitCount + 1));  
    this.commitCount++;
    this.lastCommitTime = commitTime;
  }
  getCountdownDisplay(){
    let remainingDays = Math.floor((this.timeUntilNCommit / 86400000));
    let remainingHours = Math.floor((this.timeUntilNCommit / 3600000) % 24).toFixed();
    let remainingMinutes = Math.floor(((this.timeUntilNCommit / 60000) % 60)).toFixed();
    let remainingSeconds = Math.floor(((this.timeUntilNCommit / 1000) % 60)).toFixed();
    if(parseInt(remainingSeconds) < 0){
      return ('00:00:00');
    } else {
      return(`${remainingDays} Days, ${remainingHours} Hours, ${remainingMinutes} Minutes, ${remainingSeconds} Seconds`);
    }
  }
}
