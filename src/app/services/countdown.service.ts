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
  constructor(private http: HttpClient) {}

  getCommitData() {
    return this.http.get("https://api.staging.coord.co/codechallenge/commits");
  }
  processCommitData(data) {
    this.commitCount = data.length;
    this.lastCommitTime = data[data.length- 1];
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
    this.averageCommitTime = timeBetweenCommits.reduce((total, item) => total + item, 0) / timeBetweenCommits.length;
  }
  getTimeToNCommit(length, n, average){
    let remainingCommits = n - length;
    let remainingTime = remainingCommits * average;

    return(remainingTime);
  }
  getCommitDate(time){
    return Date.now() + time;
  }
  addCommit(){
    let commitTime = Date.now();
    this.lastCommitTime = commitTime;
    let newCommitTime = commitTime - this.lastCommitTime;
    this.averageCommitTime = ((this.averageCommitTime * this.commitCount) + newCommitTime) / this.commitCount + 1;
    this.commitCount++;
  }
}
