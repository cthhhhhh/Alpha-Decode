package com.csd.cs203t1.quiz;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Getter @Setter @NoArgsConstructor
@Entity
@DiscriminatorValue("REVISION")
public class RevisionQuiz extends Quiz {
    private int afterLessonIndex; // 0-based index of the last lesson in this group
}
