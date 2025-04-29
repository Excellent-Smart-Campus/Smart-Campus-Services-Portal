function mapCoursesToOptions(courses) {
    if (!courses || !Array.isArray(courses)) return [];

    return courses.map(course => ({
        label: course.courseName ?? '',
        value: course.courseId ?? null,
    }));
}

function mapSubjectsToOptions(subjects) {
    if (!subjects || !Array.isArray(subjects)) return [];
    return subjects.map(subject => ({
        label: subject.isMandatory ? `${subject.subjectName} *` : subject.subjectName ?? '',
        value: subject.subjectId ?? null,
    }));
}

function mapTitlesToOptions(subjects) {
    if (!subjects || !Array.isArray(subjects)) return [];

    return subjects.map(subject => ({
        label: subject.description ?? '',
        value: subject.titleId ?? null,
    }));
}

export { mapSubjectsToOptions, mapCoursesToOptions, mapTitlesToOptions };
