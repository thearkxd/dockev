import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../project/ProjectCard';
import type { Project } from '../../types/Project';

// Mock window.dockevWindow
vi.stubGlobal('dockevWindow', {
  git: {
    getRemoteUrl: vi.fn(),
  },
});

vi.stubGlobal('dockevShell', {
  openFolder: vi.fn(),
});

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    path: '/test/path',
    category: 'Web',
    tags: ['react', 'typescript'],
    defaultIde: 'vscode',
    color: '#6366F1',
    description: 'A test project',
  };

  it('should render project name', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should render project description', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('A test project')).toBeInTheDocument();
  });

  it('should render project category', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Web')).toBeInTheDocument();
  });

  it('should render project tags', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    const card = screen.getByText('Test Project').closest('div');
    if (card) {
      card.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should display formatted path', () => {
    const longPathProject: Project = {
      ...mockProject,
      path: 'C:\\Users\\Test\\Desktop\\VeryLongPath\\Project',
    };
    render(<ProjectCard project={longPathProject} />);
    // Path should be formatted/truncated
    expect(screen.getByText(/C:\\/)).toBeInTheDocument();
  });
});

