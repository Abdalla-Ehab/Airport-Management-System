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
    private String boarding_group;
    private Boolean is_boarded;
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
    public String getBoarding_group() {
        return boarding_group;
    }
    public void setBoarding_group(String boarding_group) {
        this.boarding_group = boarding_group;
    }
    public Boolean getIs_boarded() {
        return is_boarded;
    }
    public void setIs_boarded(Boolean is_boarded) {
        this.is_boarded = is_boarded;
    }
    
}