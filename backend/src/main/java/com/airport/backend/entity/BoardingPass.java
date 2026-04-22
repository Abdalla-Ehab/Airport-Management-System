package com.airport.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "boarding_pass")
public class BoardingPass {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boarding_pass_id;
    private Long ticket_no;
    private Integer sequence_number;
    private LocalDateTime issue_time;
    public Long getBoarding_pass_id() {
        return boarding_pass_id;
    }
    public void setBoarding_pass_id(Long boarding_pass_id) {
        this.boarding_pass_id = boarding_pass_id;
    }
    public Long getTicket_no() {
        return ticket_no;
    }
    public void setTicket_no(Long ticket_no) {
        this.ticket_no = ticket_no;
    }
    public Integer getSequence_number() {
        return sequence_number;
    }
    public void setSequence_number(Integer sequence_number) {
        this.sequence_number = sequence_number;
    }
    public LocalDateTime getIssue_time() {
        return issue_time;
    }
    public void setIssue_time(LocalDateTime issue_time) {
        this.issue_time = issue_time;
    }
}