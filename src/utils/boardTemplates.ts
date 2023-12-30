interface BoardTemplate {
	[key: string]: {
		name: string;
		description: string;
		board: {
			title: string;
			lanes: string[];
			tags: string[];
		};
	};
}

const empty: BoardTemplate = {
	en: {
		name: 'Empty board',
		description: 'An empty board with no lanes or tags.',
		board: {
			title: 'New empty board',
			lanes: [],
			tags: []
		}
	},
	es: {
		name: 'Tablero vacío',
		description: 'Un tablero vacío sin carriles ni etiquetas.',
		board: {
			title: 'Nuevo tablero vacío',
			lanes: [],
			tags: []
		}
	}
};

const kanbanBoard: BoardTemplate = {
	en: {
		name: 'Kanban board',
		description: 'A kanban board with the default lanes and tags.',
		board: {
			title: 'New kanban board',
			lanes: ['To do', 'In progress', 'Done'],
			tags: ['Urgent']
		}
	},
	es: {
		name: 'Tablero Kanban',
		description: 'Un tablero Kanban con los carriles y etiquetas predeterminados.',
		board: {
			title: 'Nuevo tablero Kanban',
			lanes: ['Por hacer', 'En progreso', 'Hecho'],
			tags: ['Urgente']
		}
	}
};

const softwareDev: BoardTemplate = {
	en: {
		name: 'Software development',
		description: 'A board for the software development industry.',
		board: {
			title: 'New software development board',
			lanes: ['Requested', 'Development', 'Testing', 'Deployment', 'Done'],
			tags: ['Bug', 'Feature', 'Documentation']
		}
	},
	es: {
		name: 'Desarrollo de software',
		description: 'Un tablero para la industria del desarrollo de software.',
		board: {
			title: 'Nuevo tablero de desarrollo de software',
			lanes: ['Solicitado', 'Desarrollo', 'Pruebas', 'Despliegue', 'Hecho'],
			tags: ['Bug', 'Funcionalidad', 'Documentación']
		}
	}
};

const issueTracking: BoardTemplate = {
	en: {
		name: 'Issue tracker',
		description: 'A board for easily tracking and managing issues.',
		board: {
			title: 'New issue tracking board',
			lanes: ['Open', 'In progress', 'Testing', 'Closed'],
			tags: ['Bug', 'Feature', 'Improvement', 'Documentation', 'Duplicate', 'Question', 'Wontfix']
		}
	},
	es: {
		name: 'Seguimiento de problemas',
		description: 'Un tablero para rastrear y administrar fácilmente los problemas.',
		board: {
			title: 'Nuevo tablero de seguimiento de problemas',
			lanes: ['Abierto', 'En progreso', 'Pruebas', 'Cerrado'],
			tags: [
				'Bug',
				'Funcionalidad',
				'Mejora',
				'Documentación',
				'Duplicado',
				'Pregunta',
				'No se corregirá'
			]
		}
	}
};

export const boardTemplates = [empty, kanbanBoard, softwareDev, issueTracking];
