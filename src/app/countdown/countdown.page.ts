import { Component, OnInit } from "@angular/core";
import { CountdownService } from "../services/countdown.service";

@Component({
  selector: "app-countdown",
  templateUrl: "./countdown.page.html",
  styleUrls: ["./countdown.page.scss"]
})
export class CountdownPage implements OnInit {
  counterValue: number = 0;
  currentCommit: number = 0;
  lastCommit: number = 0;
  averageCommitTime: number = 0;
  timeUntilNCommit: number = 0;
  nCommitDate: number = 0;
  displayTime: string = "";
  constructor(private countdownService: CountdownService) {
    this.countdownService.getCommitData().subscribe(data => {
      this.countdownService.processCommitData(data);
      this.currentCommit = this.countdownService.commitCount + 1;
      this.lastCommit = this.countdownService.lastCommitTime;
      this.timeUntilNCommit = this.countdownService.getTimeToNCommit(this.countdownService.commitCount, 2000, this.countdownService.averageCommitTime);
      this.displayTime = this.countdownService.getCountdownDisplay();

      this.nCommitDate = this.countdownService.getCommitDate(this.timeUntilNCommit);
    });
  }

  ngOnInit() {
    setInterval(()=> {
      this.countdownService.timeUntilNCommit -= 1000;
      this.displayTime = this.countdownService.getCountdownDisplay();
    }, 1000)
  }
  makeCommit() {
    this.countdownService.addCommit();
    this.currentCommit = this.countdownService.commitCount +1;
    this.averageCommitTime = this.countdownService.averageCommitTime;
    this.lastCommit = this.countdownService.lastCommitTime;
    this.timeUntilNCommit = this.countdownService.getTimeToNCommit(this.countdownService.commitCount, 2000, this.countdownService.averageCommitTime);
    this.nCommitDate = this.countdownService.getCommitDate(this.timeUntilNCommit);
  }
}
