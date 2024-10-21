import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRequestFromContext } from './execution-context.util';

describe('getRequestFromContext', () => {
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    mockExecutionContext = {
      getType: jest.fn(),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should return HTTP request for HTTP context', () => {
    const mockRequest = { foo: 'bar' };
    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('http');
    jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequest,
    } as any);

    const result = getRequestFromContext(mockExecutionContext);

    expect(result).toBe(mockRequest);
    expect(mockExecutionContext.getType).toHaveBeenCalledWith();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalledWith();
  });

  it('should return GraphQL request for GraphQL context', () => {
    const mockRequest = { foo: 'bar' };
    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('graphql');
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: mockRequest }),
    } as any);

    const result = getRequestFromContext(mockExecutionContext);

    expect(result).toBe(mockRequest);
    expect(mockExecutionContext.getType).toHaveBeenCalledWith();
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockExecutionContext);
  });

  it('should throw NotImplementedException for unsupported context type', () => {
    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('unsupported');

    expect(() => getRequestFromContext(mockExecutionContext)).toThrow('Unsupported execution context type');
    expect(mockExecutionContext.getType).toHaveBeenCalledWith();
  });
});
