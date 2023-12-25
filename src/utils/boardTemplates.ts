interface BoardTemplate {
	[key: string]: {
		name: string;
		image: string;
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
		image: '/templates/empty.png',
		board: {
			title: 'New empty board',
			lanes: [],
			tags: []
		}
	},
	es: {
		name: 'Tablero vacío',
		image: '/templates/empty.png',
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
		image: '/templates/empty.png',
		board: {
			title: 'New kanban board',
			lanes: ['To do', 'In progress', 'Done'],
			tags: ['Urgent']
		}
	},
	es: {
		name: 'Tablero Kanban',
		image: '/templates/empty.png',
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
		image: '/templates/empty.png',
		board: {
			title: 'New software development board',
			lanes: ['Requested', 'Development', 'Testing', 'Deployment', 'Done'],
			tags: ['Bug', 'Feature', 'Documentation']
		}
	},
	es: {
		name: 'Desarrollo de software',
		image: '/templates/empty.png',
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
		image: '/templates/empty.png',
		board: {
			title: 'New issue tracking board',
			lanes: ['Open', 'In progress', 'Testing', 'Closed'],
			tags: ['Bug', 'Feature', 'Improvement', 'Documentation', 'Duplicate', 'Question', 'Wontfix']
		}
	},
	es: {
		name: 'Seguimiento de problemas',
		image: '/templates/empty.png',
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

const supportTeam: BoardTemplate = {
	en: {
		name: 'Support team',
		image: '/templates/empty.png',
		board: {
			title: 'New support team board',
			lanes: ['Requested', 'In progress', 'Tracking', 'Waiting on customer', 'Done'],
			tags: ['Urgent', 'Internal', 'Sales', 'Marketing']
		}
	},
	es: {
		name: 'Equipo de soporte',
		image: '/templates/empty.png',
		board: {
			title: 'Nuevo tablero de equipo de soporte',
			lanes: ['Solicitado', 'En progreso', 'Seguimiento', 'Esperando al cliente', 'Hecho'],
			tags: ['Urgente', 'Interno', 'Ventas', 'Marketing']
		}
	}
};

export const boardTemplates = [empty, kanbanBoard, softwareDev, issueTracking, supportTeam];
